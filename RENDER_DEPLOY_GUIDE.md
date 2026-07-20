# 🌐 ShieldHub — Render Deployment Guide

Follow these steps to deploy ShieldHub to **Render** and configure your **MongoDB Atlas** database correctly.

---

## 🛠️ Step 1: MongoDB Atlas Configuration (CRITICAL)

Since Render uses dynamic IP addresses for its services, MongoDB Atlas will block connections from Render unless you authorize external traffic.

1. Log in to your **[MongoDB Atlas Dashboard](https://cloud.mongodb.com/)**.
2. In the left sidebar, click on **Network Access** (under the *Security* section).
3. Click the **+ Add IP Address** button.
4. Select **Allow Access From Anywhere** (which adds `0.0.0.0/0`).
   
   **IMPORTANT:** Do not skip this step! If you do not allow access from anywhere, your Render app will fail to connect to MongoDB and you won't be able to log in to the admin panel.
5. Click **Confirm**.

---

## 🔑 Step 2: Get your MongoDB Connection String

1. In MongoDB Atlas, go to **Database** (under the *Deployment* section).
2. Click the **Connect** button next to your database cluster.
3. Choose **Drivers** (usually under *Connect your application*).
4. Copy the connection string. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/shieldhub?retryWrites=true&w=majority`
5. Replace `<username>` and `<password>` with your database user credentials (which are also listed in your local `.env` file).

---

## 🚀 Step 3: Create a Web Service on Render

1. Log in to your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub/GitLab repository containing the ShieldHub code.
4. Set the following settings:
   - **Name**: `shieldhub` (or any name you prefer)
   - **Environment**: `Node`
   - **Region**: Choose the region closest to you
   - **Branch**: `main` (or the branch you want to deploy)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or any other tier)

---

## ⚙️ Step 4: Configure Environment Variables on Render

To make the admin panel work and authenticate correctly, you must specify the environment variables on Render.

1. Go to the **Environment** tab of your new Web Service on Render.
2. Click **Add Environment Variable** and enter the following key-value pairs:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables secure session cookies over HTTPS |
| `MONGODB_URI` | *Your MongoDB Atlas connection string from Step 2* | Connects the app to your cloud database |
| `SESSION_SECRET` | `SomeRandomLongSecureKeyGoesHere` | Secret key used to encrypt user sessions |
| `ADMIN_RECOVERY_KEY` | `ShieldHub@Recovery#2026` | Recovery key for password resets |
| `DEFAULT_ADMIN_USERNAME` | `admin` | Default admin username (will be auto-created on first run) |
| `DEFAULT_ADMIN_PASSWORD` | `admin123` | Default admin password (will be auto-created on first run) |

3. Click **Save Changes**. Render will automatically redeploy the service.

---

## 🛡️ Step 5: Verify the Admin Login on Live Website

1. Once Render says **Deploy Live**, open the live website URL (e.g. `https://shieldhub.onrender.com`).
2. Navigate to the admin login page by going to `https://your-site.render.com/admin` (or `/admin/login`).
3. Enter the default username and password (e.g. `admin` and `admin123`).
4. Solve the CAPTCHA question and click **Sign In**.
5. You should now be logged into the **Admin Dashboard**!

---

## 💡 Troubleshooting

- **"Database connection is not established..." error on admin page**:
  This means the app could not connect to MongoDB. Check that you copied the connection string correctly (including username/password) into the `MONGODB_URI` environment variable in the Render settings, and verify that you whitelisted `0.0.0.0/0` under Network Access on MongoDB Atlas.
- **Login fails/invalid credentials**:
  If you need to reset the admin user, you can run the reset script locally pointing to your Atlas database or use the **Forgot credentials?** link on the admin login page with your `ADMIN_RECOVERY_KEY`.
