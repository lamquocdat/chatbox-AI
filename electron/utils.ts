export const isDev = process.env.NODE_ENV === 'development' || 
                 process.argv.includes('--development');

export const isProduction = !isDev;
