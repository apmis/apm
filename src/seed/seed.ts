import { config } from "dotenv";
config();
import { MongoClient, ObjectId } from "mongodb";
import { hash } from "bcryptjs";
import {
  ALL_PERMISSIONS,
  NATIONAL_ADMIN_PERMISSIONS,
  STATE_ADMIN_PERMISSIONS,
  LGA_COORDINATOR_PERMISSIONS,
  WARD_AGENT_PERMISSIONS,
  FIELD_AGENT_PERMISSIONS,
} from "../permissions.js";

const URI =
  process.env.mongodb ||
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/apm-campaign";
const NAMES = [
  "Rashidi Adebayo",
  "Modupe Alabi",
  "Ifeanyi Okafor",
  "Grace Okoro",
  "Sikiru Lawal",
  "Bukola Salami",
  "Yusuf Bello",
  "Nkechi Umeh",
  "Segun Ogunlade",
  "Aminat Yusuf",
  "Rotimi Adegoke",
  "Chioma Nwankwo",
  "Tunde Ojo",
  "Folake Adeyemi",
  "Chinedu Okonkwo",
  "Aisha Bello",
  "Segun Akinlade",
  "Titilayo Ogun",
  "Emeka Nwosu",
  "Bisi Ademola",
];

async function seed() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db();
  const now = new Date();
  const base = { createdAt: now, updatedAt: now, revision: 1 };

  const usersExist = await db.collection("users").countDocuments();
  if (usersExist === 0) {
    const passwordHash = await hash("password", 12);

    // ─── Seed permissions ──────────────────────────────────────────
    const permsExist = await db.collection("permissions").countDocuments();
    if (permsExist === 0) {
      const permDocs = ALL_PERMISSIONS.map((p) => ({ ...p, ...base }));
      await db.collection("permissions").insertMany(permDocs);
      console.log(`Seeded ${permDocs.length} permissions`);
    }

    // ─── Seed roles ────────────────────────────────────────────────
    const rolesExist = await db.collection("roles").countDocuments();
    if (rolesExist === 0) {
      const roleDocs = [
        {
          code: "NATIONAL_ADMIN",
          name: "National Admin",
          description: "Full system access across all modules and geographies.",
          permissionCodes: NATIONAL_ADMIN_PERMISSIONS,
          isSystemRole: true,
          status: "active",
        },
        {
          code: "STATE_ADMIN",
          name: "State Admin",
          description:
            "State-level administration with read/write across most modules.",
          permissionCodes: STATE_ADMIN_PERMISSIONS,
          isSystemRole: true,
          status: "active",
        },
        {
          code: "LGA_COORDINATOR",
          name: "LGA Coordinator",
          description:
            "LGA-level coordination and field operations management.",
          permissionCodes: LGA_COORDINATOR_PERMISSIONS,
          isSystemRole: true,
          status: "active",
        },
        {
          code: "WARD_AGENT",
          name: "Ward Agent",
          description: "Ward-level field operations and data collection.",
          permissionCodes: WARD_AGENT_PERMISSIONS,
          isSystemRole: true,
          status: "active",
        },
        {
          code: "FIELD_AGENT",
          name: "Field Agent",
          description: "Basic data collection and incident reporting.",
          permissionCodes: FIELD_AGENT_PERMISSIONS,
          isSystemRole: true,
          status: "active",
        },
      ].map((r) => ({ ...r, ...base }));
      await db.collection("roles").insertMany(roleDocs);
      console.log(`Seeded ${roleDocs.length} roles`);
    }

    // ─── Create admin user ─────────────────────────────────────────
    const adminId = new ObjectId();
    await db.collection("users").insertOne({
      _id: adminId,
      name: "Admin",
      email: "admin@apm.com",
      password: passwordHash,
      permissions: NATIONAL_ADMIN_PERMISSIONS,
      primaryRoleCode: "NATIONAL_ADMIN",
      accountStatus: "active",
      isPhoneVerified: true,
      isEmailVerified: true,
      totpEnabled: false,
      twoFactorMethod: "none",
      ...base,
    });
    console.log("Seeded default admin user: admin / password");

    // ─── Assign National Admin role to admin user ──────────────────
    const nationalAdminRole = await db
      .collection("roles")
      .findOne({ code: "NATIONAL_ADMIN" });
    if (nationalAdminRole) {
      await db.collection("roleAssignments").insertOne({
        userId: adminId.toString(),
        roleId: nationalAdminRole._id.toString(),
        roleCode: "NATIONAL_ADMIN",
        effectiveFrom: now.toISOString(),
        isPrimary: true,
        status: "active",
        ...base,
      });
      console.log("Assigned NATIONAL_ADMIN role to admin user");
    }

    // ─── Seed default field agent role assignment for new users ─────
    // (this is a reference — new registrations won't get an assignment
    //  automatically until the registration flow is updated, but the
    //  role definition exists so the sync hook will work once assigned.)
  } else {
    console.log("Users already seeded, skipping default admin user");
  }

  // --- States ---
  const statesExist = await db.collection("states").countDocuments();
  if (statesExist === 0) {
    const states = [
      { code: "AB", name: "Abia", displayOrder: 0 },
      { code: "AD", name: "Adamawa", displayOrder: 1 },
      { code: "AK", name: "Akwa Ibom", displayOrder: 2 },
      { code: "AN", name: "Anambra", displayOrder: 3 },
      { code: "BA", name: "Bauchi", displayOrder: 4 },
      { code: "BY", name: "Bayelsa", displayOrder: 5 },
      { code: "BE", name: "Benue", displayOrder: 6 },
      { code: "BO", name: "Borno", displayOrder: 7 },
      { code: "CR", name: "Cross River", displayOrder: 8 },
      { code: "DT", name: "Delta", displayOrder: 9 },
      { code: "EB", name: "Ebonyi", displayOrder: 10 },
      { code: "ED", name: "Edo", displayOrder: 11 },
      { code: "EK", name: "Ekiti", displayOrder: 12 },
      { code: "EN", name: "Enugu", displayOrder: 13 },
      { code: "FC", name: "FCT", displayOrder: 14 },
      { code: "GO", name: "Gombe", displayOrder: 15 },
      { code: "IM", name: "Imo", displayOrder: 16 },
      { code: "JI", name: "Jigawa", displayOrder: 17 },
      { code: "KD", name: "Kaduna", displayOrder: 18 },
      { code: "KN", name: "Kano", displayOrder: 19 },
      { code: "KT", name: "Katsina", displayOrder: 20 },
      { code: "KE", name: "Kebbi", displayOrder: 21 },
      { code: "KO", name: "Kogi", displayOrder: 22 },
      { code: "KW", name: "Kwara", displayOrder: 23 },
      { code: "LA", name: "Lagos", displayOrder: 24 },
      { code: "NA", name: "Nasarawa", displayOrder: 25 },
      { code: "NI", name: "Niger", displayOrder: 26 },
      { code: "OG", name: "Ogun", displayOrder: 27 },
      { code: "ON", name: "Ondo", displayOrder: 28 },
      { code: "OS", name: "Osun", displayOrder: 29 },
      { code: "OY", name: "Oyo", displayOrder: 30 },
      { code: "PL", name: "Plateau", displayOrder: 31 },
      { code: "RV", name: "Rivers", displayOrder: 32 },
      { code: "SO", name: "Sokoto", displayOrder: 33 },
      { code: "TA", name: "Taraba", displayOrder: 34 },
      { code: "YO", name: "Yobe", displayOrder: 35 },
      { code: "ZA", name: "Zamfara", displayOrder: 36 },
    ].map((s) => ({ ...s, ...base }));
    await db.collection("states").insertMany(states);
    console.log(`Seeded ${states.length} states`);
  }

  // --- LGAs ---
  const lgasExist = await db.collection("lgas").countDocuments();
  if (lgasExist > 0) {
    console.log("LGAs already seeded, skipping rest");
    await client.close();
    return;
  }

  const lgas = [
    { code: "AFI", name: "Afijio", region: "Oyo", displayOrder: 0 },
    { code: "AKI", name: "Akinyele", region: "Oyo", displayOrder: 1 },
    { code: "ATI", name: "Atiba", region: "Oyo", displayOrder: 2 },
    { code: "ATS", name: "Atisbo", region: "Oyo", displayOrder: 3 },
    { code: "EGB", name: "Egbeda", region: "Oyo", displayOrder: 4 },
    { code: "IBN", name: "Ibadan North", region: "Ibadan", displayOrder: 5 },
    {
      code: "INE",
      name: "Ibadan North-East",
      region: "Ibadan",
      displayOrder: 6,
    },
    {
      code: "INW",
      name: "Ibadan North-West",
      region: "Ibadan",
      displayOrder: 7,
    },
    {
      code: "ISE",
      name: "Ibadan South-East",
      region: "Ibadan",
      displayOrder: 8,
    },
    {
      code: "ISW",
      name: "Ibadan South-West",
      region: "Ibadan",
      displayOrder: 9,
    },
    {
      code: "IPC",
      name: "Ibarapa Central",
      region: "Ibarapa",
      displayOrder: 10,
    },
    { code: "IPE", name: "Ibarapa East", region: "Ibarapa", displayOrder: 11 },
    { code: "IPN", name: "Ibarapa North", region: "Ibarapa", displayOrder: 12 },
    { code: "IDO", name: "Ido", region: "Oyo", displayOrder: 13 },
    { code: "IRE", name: "Irepo", region: "Oyo", displayOrder: 14 },
    { code: "ISY", name: "Iseyin", region: "Oyo", displayOrder: 15 },
    { code: "ITW", name: "Itesiwaju", region: "Oyo", displayOrder: 16 },
    { code: "IWA", name: "Iwajowa", region: "Oyo", displayOrder: 17 },
    { code: "KAJ", name: "Kajola", region: "Oyo", displayOrder: 18 },
    { code: "LAG", name: "Lagelu", region: "Oyo", displayOrder: 19 },
    {
      code: "OGN",
      name: "Ogbomoso North",
      region: "Ogbomoso",
      displayOrder: 20,
    },
    {
      code: "OGS",
      name: "Ogbomoso South",
      region: "Ogbomoso",
      displayOrder: 21,
    },
    { code: "OGO", name: "Ogo Oluwa", region: "Oyo", displayOrder: 22 },
    { code: "OLO", name: "Olorunsogo", region: "Oyo", displayOrder: 23 },
    { code: "OLU", name: "Oluyole", region: "Ibadan", displayOrder: 24 },
    { code: "ONA", name: "Ona Ara", region: "Ibadan", displayOrder: 25 },
    { code: "ORE", name: "Orelope", region: "Oyo", displayOrder: 26 },
    { code: "ORI", name: "Ori Ire", region: "Oyo", displayOrder: 27 },
    { code: "OYE", name: "Oyo East", region: "Oyo", displayOrder: 28 },
    { code: "OYW", name: "Oyo West", region: "Oyo", displayOrder: 29 },
    { code: "SAE", name: "Saki East", region: "Oyo", displayOrder: 30 },
    { code: "SAW", name: "Saki West", region: "Oyo", displayOrder: 31 },
    { code: "SUR", name: "Surulere", region: "Oyo", displayOrder: 32 },
  ];
  const oyoState = await db.collection("states").findOne({ code: "OY" });
  const oyoStateId = oyoState?._id?.toString() || "";
  const lgaDocs = lgas.map((l) => ({ ...l, stateId: oyoStateId, ...base }));
  await db.collection("lgas").insertMany(lgaDocs);
  console.log(`Seeded ${lgas.length} LGAs`);

  const lgaRecords = await db
    .collection("lgas")
    .find()
    .sort({ displayOrder: 1 })
    .toArray();

  // --- Wards ---
  const wardDocs: any[] = [];
  let wardOrder = 0;
  for (const lga of lgaRecords) {
    for (let i = 1; i <= 11; i++) {
      wardDocs.push({
        name: `Ward ${i}`,
        code: `${lga.code}W${String(i).padStart(2, "0")}`,
        lgaId: lga._id.toString(),
        displayOrder: wardOrder++,
        ...base,
      });
    }
  }
  await db.collection("wards").insertMany(wardDocs);
  console.log(`Seeded ${wardDocs.length} wards`);

  const wardRecords = await db.collection("wards").find({}).toArray();

  // --- Polling Units ---
  const puDocs: any[] = [];
  for (const ward of wardRecords.slice(0, 33)) {
    const parentLga = lgaRecords.find((l) => l._id.toString() === ward.lgaId);
    for (let i = 1; i <= 5; i++) {
      puDocs.push({
        code: `${ward.code}PU${String(i).padStart(3, "0")}`,
        name: `${ward.name} Polling Unit ${i}`,
        wardId: ward._id.toString(),
        lgaId: ward.lgaId,
        registeredVoters: Math.floor(Math.random() * 500) + 200,
        location: {
          type: "Point",
          coordinates: [3.9 + Math.random(), 7.4 + Math.random()],
        },
        ...base,
      });
    }
  }
  await db.collection("pollingUnits").insertMany(puDocs);
  console.log(`Seeded ${puDocs.length} polling units`);

  const puRecords = await db.collection("pollingUnits").find({}).toArray();

  // --- Stakeholders ---
  const stakeDocs: any[] = [];
  const roles = [
    "traditional",
    "religious",
    "political",
    "community",
    "youth",
    "women",
    "professional",
    "market",
  ];
  const affiliations = ["PDP", "APC", "APM", "LP", "Other"];
  const statuses = [
    "untouched",
    "engaged",
    "leaning",
    "won",
    "lost",
    "hostile",
  ];
  for (const lga of lgaRecords.slice(0, 6)) {
    for (let i = 0; i < 5; i++) {
      stakeDocs.push({
        fullName: `Stakeholder ${i + 1} - ${lga.name}`,
        phoneNumber: `080${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
        stakeholderType: roles[Math.floor(Math.random() * roles.length)],
        lgaId: lga._id.toString(),
        affiliation:
          affiliations[Math.floor(Math.random() * affiliations.length)],
        influenceLevel: ["high", "medium", "low"][
          Math.floor(Math.random() * 3)
        ],
        conversionStatus: statuses[Math.floor(Math.random() * statuses.length)],
        ...base,
      });
    }
  }
  await db.collection("stakeholders").insertMany(stakeDocs);
  console.log(`Seeded ${stakeDocs.length} stakeholders`);

  // --- Ward Conversion Assessments ---
  const wcaDocs = wardRecords.slice(0, 33).map((ward, i) => ({
    wardId: ward._id.toString(),
    assessmentWeek: "2026-W25",
    score: Math.floor(Math.random() * 60) + 20,
    status: ["green", "yellow", "red", "grey"][i % 4],
    ...base,
  }));
  await db.collection("wardConversionAssessments").insertMany(wcaDocs);
  console.log(`Seeded ${wcaDocs.length} ward conversion assessments`);

  // --- WhatsApp Groups ---
  const waDocs = [
    {
      level: "state",
      name: "APM Oyo State Command",
      description: "State-level coordination",
      memberCount: 15,
    },
    {
      level: "senatorial",
      name: "APM Oyo Central",
      description: "Central coordination",
      memberCount: 25,
    },
    {
      level: "senatorial",
      name: "APM Oyo North",
      description: "North coordination",
      memberCount: 25,
    },
    {
      level: "senatorial",
      name: "APM Oyo South",
      description: "South coordination",
      memberCount: 25,
    },
  ];
  await db
    .collection("whatsappGroups")
    .insertMany(waDocs.map((g) => ({ ...g, ...base })));
  console.log(`Seeded ${waDocs.length} WhatsApp groups`);

  // --- Campaign Info ---
  const infoDocs = [
    {
      key: "trust_banner",
      value: "Continuity with Competence",
      label: "Trust Banner",
      displayOrder: 0,
    },
    {
      key: "hero_headline",
      value: "Building on Progress. Securing Our Future.",
      label: "Hero Headline",
      displayOrder: 1,
    },
    {
      key: "hero_subheadline",
      value:
        "Bimbo Adekanmbi — Proven leadership to sustain and advance Oyo State's transformation.",
      label: "Hero Subheadline",
      displayOrder: 2,
    },
    {
      key: "candidate_name",
      value: "Bimbo Adekanmbi",
      label: "Candidate Name",
      displayOrder: 3,
    },
    {
      key: "candidate_tagline",
      value: "Your Choice for Continuous Transformation",
      label: "Candidate Tagline",
      displayOrder: 4,
    },
    {
      key: "video_url",
      value: "https://www.youtube.com/watch?v=NGexChoo52g",
      label: "Campaign Video",
      displayOrder: 5,
    },
  ];
  await db
    .collection("campaignInfo")
    .insertMany(infoDocs.map((d) => ({ ...d, ...base, isActive: true })));
  console.log(`Seeded ${infoDocs.length} campaign info entries`);

  // --- Content Items (Achievements + Agenda + News as content items) ---
  const contentDocs = [
    {
      title: "Economic Transformation",
      contentType: "achievement",
      body: "Strategic investments in agribusiness, infrastructure, and job creation.",
      status: "published",
      tags: ["economy"],
    },
    {
      title: "Education Revolution",
      contentType: "achievement",
      body: "Over 500 schools rehabilitated across all 33 LGAs.",
      status: "published",
      tags: ["education"],
    },
    {
      title: "Healthcare Access",
      contentType: "achievement",
      body: "Upgraded secondary health facilities across the state.",
      status: "published",
      tags: ["healthcare"],
    },
    {
      title: "Continuity with Competence",
      contentType: "news",
      body: "Why Bimbo Adekanmbi believes continuity is the best strategy for Oyo State.",
      status: "published",
      tags: ["policy"],
    },
    {
      title: "Grassroots Movement Grows",
      contentType: "news",
      body: "Over 10,000 volunteer registrations across all 33 LGAs.",
      status: "published",
      tags: ["campaign"],
    },
  ];
  await db
    .collection("contentItems")
    .insertMany(contentDocs.map((d) => ({ ...d, ...base })));
  console.log(`Seeded ${contentDocs.length} content items`);

  // --- Polling Unit Agents ---
  const agentDocs = puRecords.slice(0, 20).map((pu, i) => ({
    fullName: NAMES[i % NAMES.length],
    phoneNumber: `080${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
    smartphoneAvailable: true,
    powerBankAvailable: Math.random() > 0.3,
    dataBundleReady: Math.random() > 0.2,
    status: i < 12 ? "approved" : "prospective",
    ...base,
  }));
  await db.collection("pollingUnitAgents").insertMany(agentDocs);
  console.log(`Seeded ${agentDocs.length} polling unit agents`);

  const agentRecords = await db
    .collection("pollingUnitAgents")
    .find({})
    .toArray();

  // --- Agent Assignments ---
  const assignDocs = agentRecords.map((agent, i) => ({
    agentId: agent._id.toString(),
    pollingUnitId: puRecords[i % puRecords.length]._id.toString(),
    role: i % 4 === 0 ? "main" : i % 4 === 2 ? "backup" : "main",
    status: "assigned",
    effectiveFrom: new Date(Date.now() - 30 * 86400000),
    assignedBy: "seed-system",
    ...base,
  }));
  await db.collection("agentAssignments").insertMany(assignDocs);
  console.log(`Seeded ${assignDocs.length} agent assignments`);

  // --- Incidents ---
  const incidentDocs = [
    {
      incidentType: "inecDelay",
      description: "Delayed arrival of election materials by 2 hours",
      severity: "low",
      immediateHelpRequired: false,
      legalEscalationNeeded: false,
      securityEscalationNeeded: false,
      status: "resolved",
    },
    {
      incidentType: "intimidation",
      description: "Party thugs attempting to chase away voters at Ward 3",
      severity: "high",
      immediateHelpRequired: true,
      legalEscalationNeeded: false,
      securityEscalationNeeded: true,
      status: "new",
    },
    {
      incidentType: "other",
      description: "Card reader malfunction at polling unit",
      severity: "medium",
      immediateHelpRequired: false,
      legalEscalationNeeded: false,
      securityEscalationNeeded: false,
      status: "acknowledged",
    },
    {
      incidentType: "voteBuyingObservation",
      description: "Suspected vote buying near polling centre",
      severity: "critical",
      immediateHelpRequired: true,
      legalEscalationNeeded: true,
      securityEscalationNeeded: true,
      status: "new",
    },
    {
      incidentType: "agentHarassment",
      description: "APM agent being prevented from observing counting",
      severity: "high",
      immediateHelpRequired: true,
      legalEscalationNeeded: true,
      securityEscalationNeeded: false,
      status: "new",
    },
  ];
  const firstPu = puRecords[0];
  await db.collection("incidents").insertMany(
    incidentDocs.map((d) => ({
      ...d,
      geography: {
        pollingUnitId: firstPu._id.toString(),
        lgaId: firstPu.lgaId,
      },
      reportedBy: "seed-system",
      reportedAt: new Date(),
      ...base,
    })),
  );
  console.log(`Seeded ${incidentDocs.length} incidents`);

  // --- Election Results ---
  const resultDocs = puRecords.slice(0, 15).map((pu) => {
    const apmVotes = Math.floor(Math.random() * 120) + 20;
    const pdpVotes = Math.floor(Math.random() * 100) + 30;
    const apcVotes = Math.floor(Math.random() * 60);
    const otherVotes = Math.floor(Math.random() * 20);
    const total = apmVotes + pdpVotes + apcVotes + otherVotes;
    return {
      clientSubmissionId: `seed-${pu._id}`,
      electionCode: "OYO-GOV-2027",
      pollingUnitId: pu._id.toString(),
      geography: {
        pollingUnitId: pu._id.toString(),
        lgaId: pu.lgaId,
        wardId: pu.wardId,
      },
      registeredVoters: pu.registeredVoters,
      accreditedVoters: Math.floor(
        pu.registeredVoters * (0.4 + Math.random() * 0.3),
      ),
      partyResults: [
        { partyCode: "APM", partyName: "Accord", votes: apmVotes },
        { partyCode: "PDP", partyName: "PDP", votes: pdpVotes },
        { partyCode: "APC", partyName: "APC", votes: apcVotes },
        { partyCode: "OTH", partyName: "Others", votes: otherVotes },
      ],
      rejectedVotes: Math.floor(Math.random() * 5),
      totalValidVotes: total,
      totalVotesCast: total + Math.floor(Math.random() * 5),
      resultSheetMediaId: "000000000000000000000000",
      submittedBy: "seed-system",
      validation: {
        isMathematicallyValid: true,
        warnings: [],
        checksum: null,
        duplicateScore: 0,
      },
      verificationStatus: Math.random() > 0.5 ? "verified" : "pending",
      ...base,
    };
  });
  await db.collection("electionResults").insertMany(resultDocs);
  console.log(`Seeded ${resultDocs.length} election results`);

  // --- Result Verifications ---
  const verifiedResults = resultDocs.filter(
    (r) => r.verificationStatus === "verified",
  );
  const verifDocs = verifiedResults.map((r) => ({
    resultId: r.pollingUnitId,
    action: "verify",
    decision: "accepted",
    reviewerId: "seed-system",
    reviewedAt: new Date(),
    ...base,
  }));
  if (verifDocs.length > 0) {
    await db.collection("resultVerifications").insertMany(verifDocs);
    console.log(`Seeded ${verifDocs.length} result verifications`);
  }

  // --- Canvassing Reports ---
  const canvassDocs = wardRecords.slice(0, 10).map((ward, i) => ({
    sessionTitle: `Canvassing Session ${i + 1}`,
    lgaId: ward.lgaId,
    wardId: ward._id.toString(),
    teamLead: NAMES[i % NAMES.length],
    teamSize: Math.floor(Math.random() * 5) + 2,
    status: Math.random() > 0.3 ? "completed" : "planned",
    scheduledDate: new Date(
      Date.now() - Math.floor(Math.random() * 14 * 86400000),
    ),
    visitSummaries: [
      {
        name: NAMES[(i + 1) % NAMES.length],
        supportLevel: "strong",
        outcome: "positive",
      },
      {
        name: NAMES[(i + 2) % NAMES.length],
        supportLevel: "leaning",
        outcome: "neutral",
      },
    ],
    ...base,
  }));
  await db.collection("canvassingReports").insertMany(canvassDocs);
  console.log(`Seeded ${canvassDocs.length} canvassing reports`);

  // --- Volunteers ---
  const volDocs = NAMES.slice(0, 15).map((name) => ({
    fullName: name,
    phoneNumber: `080${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
    skills: ["canvassing", "data-entry", "driving", "social-media"][
      Math.floor(Math.random() * 4)
    ],
    availability: ["weekdays", "weekends", "anytime"][
      Math.floor(Math.random() * 3)
    ],
    onboarded: Math.random() > 0.3,
    ...base,
  }));
  await db.collection("volunteers").insertMany(volDocs);
  console.log(`Seeded ${volDocs.length} volunteers`);

  // --- Candidate Events ---
  const eventDocs = [
    {
      title: "Oyo North Stakeholders Engagement",
      eventType: "stakeholderMeeting",
      geography: { lgaId: lgaRecords[20]._id.toString() },
      description: "Town hall with traditional rulers",
      eventDate: new Date("2026-07-15"),
      expectedAttendees: 500,
      status: "planned",
    },
    {
      title: "Youth Summit 2026",
      eventType: "rally",
      geography: { lgaId: lgaRecords[5]._id.toString() },
      description: "Youth-focused event",
      eventDate: new Date("2026-08-01"),
      expectedAttendees: 1000,
      status: "planned",
    },
    {
      title: "Women in Leadership Conference",
      eventType: "campaignEvent",
      geography: { lgaId: lgaRecords[5]._id.toString() },
      description: "Women leaders engagement",
      eventDate: new Date("2026-08-20"),
      expectedAttendees: 300,
      status: "planned",
    },
  ];
  await db
    .collection("candidateEvents")
    .insertMany(eventDocs.map((d) => ({ ...d, ...base })));
  console.log(`Seeded ${eventDocs.length} candidate events`);

  // --- GOTV records (via canvassing context) ---
  const gotvDocs = puRecords.slice(0, 12).map((pu, i) => ({
    pollingUnitId: pu._id.toString(),
    supporterName: NAMES[i % NAMES.length],
    supporterPhone: `080${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
    contacted: true,
    turnedOut: Math.random() > 0.4,
    contactedVia: ["sms", "whatsapp", "phone", "visit"][
      Math.floor(Math.random() * 4)
    ],
    contactedAt: new Date(
      Date.now() - Math.floor(Math.random() * 7 * 86400000),
    ),
    ...base,
  }));
  await db.collection("notifications").insertMany(
    gotvDocs.map((d) => ({
      recipientUserId: "000000000000000000000000",
      type: "electionDay",
      title: "GOTV Record: " + d.supporterName,
      body: `Contacted via ${d.contactedVia}`,
      priority: "normal",
      channels: ["inApp"],
      delivery: { attempts: 1, queuedAt: new Date() },
      ...base,
    })),
  );
  console.log(`Seeded ${gotvDocs.length} GOTV notifications`);

  // --- System Settings ---
  const settingsDocs = [
    {
      key: "campaign_name",
      environment: "development",
      value: "APM Oyo 2027",
      valueType: "string",
      category: "campaign",
      version: 1,
      isSensitive: false,
      status: "active",
      updatedBy: "seed-system",
    },
    {
      key: "election_code",
      environment: "development",
      value: "OYO-GOV-2027",
      valueType: "string",
      category: "election",
      version: 1,
      isSensitive: false,
      status: "active",
      updatedBy: "seed-system",
    },
    {
      key: "paginate_default",
      environment: "development",
      value: 20,
      valueType: "number",
      category: "system",
      version: 1,
      isSensitive: false,
      status: "active",
      updatedBy: "seed-system",
    },
  ];
  await db
    .collection("systemSettings")
    .insertMany(settingsDocs.map((d) => ({ ...d, ...base })));
  console.log(`Seeded ${settingsDocs.length} system settings`);

  // --- Senatorial Districts ---
  const oyoStateForDist = await db.collection("states").findOne({ code: "OY" });
  const oyoStateIdForDist = oyoStateForDist?._id?.toString() || "";
  const distDocs = [
    { code: "OYO-C", name: "Oyo Central", region: "Central", displayOrder: 0, stateId: oyoStateIdForDist },
    { code: "OYO-N", name: "Oyo North", region: "North", displayOrder: 1, stateId: oyoStateIdForDist },
    { code: "OYO-S", name: "Oyo South", region: "South", displayOrder: 2, stateId: oyoStateIdForDist },
  ];
  await db
    .collection("senatorialDistricts")
    .insertMany(distDocs.map((d) => ({ ...d, ...base })));
  console.log(`Seeded ${distDocs.length} senatorial districts`);

  await client.close();
  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
