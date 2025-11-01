import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(5000),
  ZIINA_SECRET_KEY: Joi.string().required().messages({
    'any.required': 'ZIINA_SECRET_KEY is required',
    'string.empty': 'ZIINA_SECRET_KEY cannot be empty'
  }),
  ZIINA_WEBHOOK_SECRET: Joi.string().required().messages({
    'any.required': 'ZIINA_WEBHOOK_SECRET is required',
    'string.empty': 'ZIINA_WEBHOOK_SECRET cannot be empty'
  }),
  ZIINA_API_URL: Joi.string().uri().default('https://api.ziina.com/v1'),
  FRONTEND_URL: Joi.string().uri().required().messages({
    'any.required': 'FRONTEND_URL is required',
    'string.uri': 'FRONTEND_URL must be a valid URL'
  }),
  JWT_SECRET: Joi.string().min(32).default('your-super-secret-jwt-key-change-this-in-production'),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info')
}).unknown();

export const validateEnv = (): void => {
  const { error, value } = envSchema.validate(process.env);

  if (error) {
    console.error('❌ Environment validation failed:');
    error.details.forEach((detail) => {
      console.error(`   - ${detail.message}`);
    });
    process.exit(1);
  }

  // Update process.env with validated values
  Object.assign(process.env, value);

  console.log('✅ Environment variables validated successfully');
  
  // Log important configuration (without secrets)
  console.log('📋 Configuration:');
  console.log(`   - Environment: ${process.env.NODE_ENV}`);
  console.log(`   - Port: ${process.env.PORT}`);
  console.log(`   - Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`   - Ziina API URL: ${process.env.ZIINA_API_URL}`);
  console.log(`   - Log Level: ${process.env.LOG_LEVEL}`);
};
