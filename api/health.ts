export default function handler(req: any, res: any) {
  return res.status(200).json({ status: 'ok', service: 'Fanmahal Secure Resolution Engine (Vercel Native)' });
}
