import type { HookContext, Application } from '@feathersjs/feathers';

/**
 * After-hook that populates parent names on geographic entities.
 *
 * For find: iterates over result.data, batch-fetches parent docs, attaches names.
 * For get: fetches parent docs for the single result, attaches names.
 *
 * Supported services and their populates:
 *   senatorial-districts → stateName
 *   lgas                 → stateName, districtName
 *   wards                → lgaName, stateName
 *   polling-units        → wardName, lgaName
 */

type PopulateRule = {
  /** field on this doc that holds the parent ObjectId */
  refField: string;
  /** field name to write the resolved name into */
  nameField: string;
  /** MongoDB collection to look up */
  collection: string;
  /** nested resolve: after fetching the parent, resolve another ref from it */
  nested?: {
    refField: string;
    nameField: string;
    collection: string;
  };
};

const RULES: Record<string, PopulateRule[]> = {
  'apm/senatorial-districts': [
    { refField: 'stateId', nameField: 'stateName', collection: 'states' },
  ],
  'apm/lgas': [
    { refField: 'stateId', nameField: 'stateName', collection: 'states' },
    { refField: 'senatorialDistrictId', nameField: 'districtName', collection: 'senatorialDistricts' },
  ],
  'apm/wards': [
    {
      refField: 'lgaId',
      nameField: 'lgaName',
      collection: 'lgas',
      nested: { refField: 'stateId', nameField: 'stateName', collection: 'states' },
    },
  ],
  'apm/polling-units': [
    {
      refField: 'wardId',
      nameField: 'wardName',
      collection: 'wards',
      nested: { refField: 'lgaId', nameField: 'lgaName', collection: 'lgas' },
    },
  ],
};

async function fetchNameMap(
  app: Application,
  collection: string,
  ids: string[],
): Promise<Record<string, string>> {
  if (ids.length === 0) return {};
  const client = await app.get('mongodbClient');
  const db = client.db();
  const docs = await db
    .collection(collection)
    .find({ _id: { $in: ids }, deletedAt: null })
    .project({ name: 1 })
    .toArray();
  const map: Record<string, string> = {};
  for (const doc of docs) {
    map[String(doc._id)] = doc.name;
  }
  return map;
}

async function enrichItem(
  app: Application,
  item: Record<string, any>,
  rules: PopulateRule[],
) {
  for (const rule of rules) {
    const refId = item[rule.refField];
    if (!refId) continue;

    const nameMap = await fetchNameMap(app, rule.collection, [String(refId)]);
    const name = nameMap[String(refId)];
    if (name) item[rule.nameField] = name;

    if (rule.nested && name) {
      const nestedRefId = item[rule.nested.refField];
      if (!nestedRefId) continue;
      // For wards: we already fetched the LGA doc above; grab stateId from it
      // For polling-units: we already fetched the ward doc; grab lgaId from it
      const parentMap = await fetchNameMap(app, rule.collection, [String(refId)]);
      const parentDoc = parentMap[String(refId)];
      // We need the actual parent doc to get its nested ref, so fetch the raw doc
      const client = await app.get('mongodbClient');
      const db = client.db();
      const parentRaw = await db
        .collection(rule.collection)
        .findOne({ _id: { $in: [refId] }, deletedAt: null });
      if (parentRaw) {
        const nestedRefId = parentRaw[rule.nested.refField];
        if (nestedRefId) {
          const nestedMap = await fetchNameMap(app, rule.nested.collection, [String(nestedRefId)]);
          const nestedName = nestedMap[String(nestedRefId)];
          if (nestedName) item[rule.nested.nameField] = nestedName;
        }
      }
    }
  }
}

export function populateGeography() {
  return async (context: HookContext) => {
    const path = context.path;
    const rules = RULES[path];
    if (!rules) return context;

    const { app } = context;
    if (!app) return context;

    const isArray = context.method === 'find';
    const items: Record<string, any>[] = isArray
      ? context.result?.data ?? []
      : context.result
        ? [context.result]
        : [];

    if (items.length === 0) return context;

    // Collect all unique ref IDs per collection for batch fetching
    const collectionIds = new Map<string, Set<string>>();
    for (const rule of rules) {
      for (const item of items) {
        const id = item[rule.refField];
        if (id) {
          if (!collectionIds.has(rule.collection)) collectionIds.set(rule.collection, new Set());
          collectionIds.get(rule.collection)!.add(String(id));
        }
      }
    }

    // Batch-fetch all name maps upfront
    const nameMaps = new Map<string, Record<string, string>>();
    for (const [collection, ids] of collectionIds) {
      nameMaps.set(collection, await fetchNameMap(app, collection, [...ids]));
    }

    // Enrich each item
    for (const item of items) {
      for (const rule of rules) {
        const refId = item[rule.refField];
        if (!refId) continue;

        const nameMap = nameMaps.get(rule.collection);
        const name = nameMap?.[String(refId)];
        if (name) item[rule.nameField] = name;

        // Handle nested resolution (e.g., ward→lga→state)
        if (rule.nested && name) {
          const nestedRefId = item[rule.nested.refField];
          if (!nestedRefId) continue;

          // Fetch the parent doc to get its nested ref
          const client = await app.get('mongodbClient');
          const db = client.db();
          const parentRaw = await db
            .collection(rule.collection)
            .findOne({ _id: { $in: [refId] }, deletedAt: null });
          if (parentRaw) {
            const deepRefId = parentRaw[rule.nested.refField];
            if (deepRefId) {
              const nestedMap = await fetchNameMap(app, rule.nested.collection, [String(deepRefId)]);
              const nestedName = nestedMap[String(deepRefId)];
              if (nestedName) item[rule.nested.nameField] = nestedName;
            }
          }
        }
      }
    }

    return context;
  };
}
