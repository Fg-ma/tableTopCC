# Allow validating own token
path "auth/token/lookup-self" {
  capabilities = ["read"]
}

# Allow minting tokens with arbitrary policies
path "auth/token/create" {
  capabilities = ["create", "update", "sudo"]
}

# Allow reading AppRole role IDs for mongo-* roles
path "auth/approle/role/mongo-*/role-id" {
  capabilities = ["read"]
}

# Allow generating secret IDs
path "auth/approle/role/mongo-*/secret-id" {
  capabilities = ["update"]
}