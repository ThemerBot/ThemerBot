import env from '../env';

export const getSponsor = () =>
    env.SPONSORED_BY && env.SPONSOR_MESSAGE
        ? `\n\n*Sponsored by ${env.SPONSORED_BY}:*\n${env.SPONSOR_MESSAGE}`
        : '';
