// Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:9090',
    API_ENDPOINTS: {
      TASKS: '/api/tasks'
    }
  },
  production: {
    API_BASE_URL: 'https://d8uvcfbxewqwg.cloudfront.net', // Replace with your actual backend URL
    API_ENDPOINTS: {
      TASKS: '/api/tasks'
    }
  }
};

const environment = import.meta.env.MODE || 'development';
export default config[environment];
