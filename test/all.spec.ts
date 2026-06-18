import { beforeAll, afterAll } from 'vitest';
import { setupTestEnvironment, teardownTestEnvironment, getTestContext } from './setup.js';
import { authIdentityTests } from '../../testing/use-cases/01-auth-identity.test-defs.js';
import { geographyTests } from '../../testing/use-cases/02-geography.test-defs.js';
import { campaignContentTests } from '../../testing/use-cases/03-campaign-content.test-defs.js';
import { intelligenceTests } from '../../testing/use-cases/04-intelligence.test-defs.js';
import { eventsToursTests } from '../../testing/use-cases/05-events-tours.test-defs.js';
import { conversionTests } from '../../testing/use-cases/06-conversion.test-defs.js';
import { canvassingVolunteersTests } from '../../testing/use-cases/07-canvassing-volunteers.test-defs.js';
import { electionDayTests } from '../../testing/use-cases/08-election-day.test-defs.js';
import { resultsVerificationTests } from '../../testing/use-cases/09-results-verification.test-defs.js';
import { infrastructureTests } from '../../testing/use-cases/10-infrastructure.test-defs.js';

beforeAll(async () => {
  await setupTestEnvironment();
}, 60000);

afterAll(async () => {
  await teardownTestEnvironment();
}, 30000);

authIdentityTests(getTestContext);
geographyTests(getTestContext);
campaignContentTests(getTestContext);
intelligenceTests(getTestContext);
eventsToursTests(getTestContext);
conversionTests(getTestContext);
canvassingVolunteersTests(getTestContext);
electionDayTests(getTestContext);
resultsVerificationTests(getTestContext);
infrastructureTests(getTestContext);
