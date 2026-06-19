# Deployment Guide

This guide outlines how to deploy the Skill Exchange Platform backend to Render and frontend to Vercel.

## Architecture

- **Backend**: Node.js/Express API → Render
- **Frontend**: React SPA → Vercel
- **Database**: MongoDB (Atlas or local)
- **Real-time**: Socket.IO on Render backend

## Backend Deployment (Render)

### 1. Prepare Backend Repository

The backend is already configured for Render deployment. Key files:
- `backend/server.js` - Express server
- `backend/package.json` - Dependencies

### 2. Deploy to Render

1. Go to [Render.com](https://render.com)
2. Sign in with GitHub account
3. Click **New +** → **Web Service**
4. Select the repository: `Skill-Exchange-Platform`
5. Configure the service:
   - **Name**: `skill-exchange-platform` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`

6. Set environment variables in Render dashboard:
   ```
   MONGO_URI=<your-mongodb-connection-string>
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=<your-secret-key>
   ```

7. Deploy and note the URL (e.g., `https://skill-exchange-platform-x98i.onrender.com`)

### 3. Test Backend

```bash
curl https://skill-exchange-platform-x98i.onrender.com/api/auth/test
```

## Frontend Deployment (Vercel)

### 1. Prepare Frontend

The frontend is now configured with environment-based API URLs via `frontend/src/api.js`.

- Uses `process.env.REACT_APP_API_URL` if set
- Falls back to the default Render backend URL if not set
- All API calls now use the shared `API_URL` constant

### 2. Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub account
3. Click **Add New** → **Project**
4. Select the repository: `Skill-Exchange-Platform`
5. Configure project settings:
   - **Project Name**: `skill-exchange-platform` (or your preferred name)
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

6. Set environment variables in Vercel dashboard (Environment Variables section):
   ```
   REACT_APP_API_URL=https://skill-exchange-platform-x98i.onrender.com
   ```
   
   Replace the URL with your actual Render backend URL if different.

7. Deploy by clicking **Deploy**

### 3. Verify Frontend

Once deployed, verify:
- Frontend loads at the provided Vercel URL
- Can register/login successfully
- API calls reach the backend (check browser Network tab)

## Environment Variable Reference

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend-domain.onrender.com
```

### Backend (Render)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skill-exchange
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secret-key-here
```

## Troubleshooting

### Frontend Build Fails on Vercel
- Ensure `REACT_APP_API_URL` is set in Vercel environment variables
- Check that all API imports are using the shared `api.js` helper
- Verify no hardcoded URLs remain (should be none after refactor)

### Backend Connection Errors
- Verify `MONGO_URI` is correct in Render environment variables
- Check MongoDB user/password credentials
- Ensure IP whitelist includes Render's IP range (usually "0.0.0.0/0" for All)

### Socket.IO Connection Issues
- Verify backend `CORS` settings allow Vercel frontend domain
- Ensure Socket.IO client uses same `API_URL` as REST API
- Check browser Network tab for WebSocket connection attempts

### API Calls Return 404/500
- Verify Render backend is running (`npm start` in backend directory)
- Check backend logs in Render dashboard
- Ensure all API routes are registered in `backend/routes/`

## Local Development

### Start Backend (with hotreload)
```bash
cd backend
npm install
npm run dev
```

### Start Frontend
```bash
cd frontend
npm install
npm start
```

Frontend automatically connects to `http://localhost:5000` if `REACT_APP_API_URL` is not set.

## Post-Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] `REACT_APP_API_URL` env var set on Vercel
- [ ] Can create account and login
- [ ] Can view profile and edit skills
- [ ] Can search for skills and send connection requests
- [ ] Chat functionality works via Socket.IO
- [ ] Real-time notifications deliver
- [ ] Reviews and ratings display correctly

## Continuous Deployment

Both Render and Vercel support automatic deployments on push to `main` branch:
- **Render**: Auto-deploys when `main` branch updated
- **Vercel**: Auto-deploys with GitHub integration

## Monitoring

- **Render**: View logs in dashboard or `render.com/services`
- **Vercel**: View deployment logs and analytics in dashboard
- **MongoDB**: Monitor connection pool and query performance in Atlas dashboard

## Updating Code

After making changes:

1. Commit and push to `main` branch:
   ```bash
   git add -A
   git commit -m "your message"
   git push origin main
   ```

2. Both Render and Vercel will auto-deploy within minutes

## Contact & Support

For deployment issues:
- Check Render logs: Render Dashboard → Service → Logs
- Check Vercel logs: Vercel Dashboard → Project → Deployments → Logs
- Check MongoDB Atlas dashboard for connection issues
