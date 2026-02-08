---
description: Deploying the application to Azure
---

This workflow guides you through deploying the React .NET application to Azure. You can choose between the **Azure CLI** or the **Azure Portal (Web)**.

---

## Option 1: Using the Azure Portal (Web Interface)

### Step 1: Deploy Backend (App Service)
1. **Create a Resource Group**:
   - Search for **Resource groups** in the portal.
   - Click **Create**, name it `NexusAppResourceGroup`, and select a region (e.g., East US).
2. **Create a Web App**:
   - Search for **App Services** and click **Create** > **Web App**.
   - **Basics**: Select your RG, name the app (e.g., `nexus-backend-api`).
   - **Publish**: Choose **Code**.
   - **Runtime stack**: Select **.NET 9 (LTS)**.
   - **Operating System**: **Linux**.
   - Click **Review + create** then **Create**.
3. **Deploy Code**:
   - Once created, go to **Deployment Center**.
   - Select your source (e.g., GitHub) and follow the prompts to authorize and select your repository.
   - Set the build context to the `/Backend` folder.

### Step 2: Deploy Frontend (Static Web Apps)
1. **Create Static Web App**:
   - Search for **Static Web Apps** and click **Create**.
   - **Basics**: Select your RG, name it `nexus-frontend`.
   - **Deployment details**: Select **GitHub** and authorize.
   - **Build Details**:
     - **App location**: `/Frontend`
     - **Api location**: (Leave blank)
     - **Output location**: `dist`
2. Click **Review + create** then **Create**. Azure will automatically set up a GitHub Action to deploy your frontend.

### Step 3: Connect Frontend to Backend
1. **CORS Configuration**:
   - Go to your **Backend App Service**.
   - In the left menu, search for **CORS**.
   - Add your Frontend URL (e.g., `https://proud-beach-xxx.azurestaticapps.net`) to the allowed origins.
2. **API URL**:
   - In your Frontend code (`api.ts`), update the `baseURL` to point to your new Azure Backend URL (e.g., `https://nexus-backend-api.azurewebsites.net/api`).

---

## Option 2: Using the Azure CLI

### Step 1: Deploy Backend
1. Login: `az login`
2. Create Resource Group: `az group create --name NexusAppResourceGroup --location eastus`
3. Create App Service Plan: `az appservice plan create --name NexusAppPlan --resource-group NexusAppResourceGroup --sku B1 --is-linux`
4. Create Web App: `az webapp create --resource-group NexusAppResourceGroup --plan NexusAppPlan --name nexus-backend-api --runtime "DOTNET|9.0"`
5. (Optional) If using Docker: `az acr create...` (See full Docker flow below).

### Step 2: Deploy Frontend
1. Create Static Web App:
   ```bash
   az staticwebapp create --name nexus-frontend --resource-group NexusAppResourceGroup --location eastus --branch main --source-code-url <YOUR_GITHUB_REPO_URL> --app-location /Frontend --output-location dist
   ```

---

## Critical Post-Deployment Steps
1. **Update `api.ts`**: The `baseURL` in `Frontend/src/services/api.ts` must be changed from `localhost` to your production URL.
2. **CORS**: The Backend must explicitly allow the Frontend's domain in the Azure Portal CORS settings.
