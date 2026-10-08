import { sendApprovalEmail } from './src/services/email';

async function run() {
  console.log('Sending approval email to pranav.sharma77715@gmail.com...');
  const result = await sendApprovalEmail({
    applicationId: 'test-app-id-123',
    companyName: 'Test Company',
    email: 'pranav.sharma77715@gmail.com',
    onboardingToken: 'test-token-456',
    missingDocs: []
  });
  console.log('Result:', result);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
