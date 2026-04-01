@description('Azure region for all resources')
param location string = resourceGroup().location

@description('SQL Server name (must be globally unique)')
param sqlServerName string

@description('SQL admin username')
param sqlAdminLogin string

@secure()
@description('SQL admin password')
param sqlAdminPassword string

@description('SQL Database name')
param sqlDatabaseName string = 'fieldcheck'

@description('Cognitive Services account name (must be globally unique)')
param cognitiveAccountName string

@description('SKU for Cognitive Services (Face)')
param cognitiveSkuName string = 'S0'

resource sqlServer 'Microsoft.Sql/servers@2023-08-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
    publicNetworkAccess: 'Enabled'
  }
}

// Allow Azure services to access the server (common baseline; tighten for prod)
resource sqlFirewallAzureServices 'Microsoft.Sql/servers/firewallRules@2023-08-01-preview' = {
  name: 'AllowAzureServices'
  parent: sqlServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource sqlDb 'Microsoft.Sql/servers/databases@2023-08-01-preview' = {
  name: '${sqlServer.name}/${sqlDatabaseName}'
  location: location
  sku: {
    name: 'Basic'
    tier: 'Basic'
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648
  }
}

resource cognitiveFace 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: cognitiveAccountName
  location: location
  kind: 'Face'
  sku: {
    name: cognitiveSkuName
  }
  properties: {
    publicNetworkAccess: 'Enabled'
  }
}

output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
output sqlDatabaseResourceId string = sqlDb.id
output cognitiveEndpoint string = cognitiveFace.properties.endpoint
