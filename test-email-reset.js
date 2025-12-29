// Add this to password-management component for testing

async testEmailReset() {
  console.log('🧪 Testing email reset...');
  
  try {
    const result = await this.supabaseService.resetPassword('test@example.com');
    console.log('📧 Email result:', result);
    
    if (result.error) {
      console.error('❌ Email error:', result.error);
      alert(`Email Error: ${result.error.message}`);
    } else {
      console.log('✅ Email sent successfully');
      alert('✅ Email sent! Check console for details');
    }
  } catch (error) {
    console.error('💥 Exception:', error);
    alert(`Exception: ${error}`);
  }
}