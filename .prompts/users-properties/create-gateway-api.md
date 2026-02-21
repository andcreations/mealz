Use `backend/backend-server/src/domains/users/services/crud/gateway-api` as reference. 
In `backend/backend-server/src/domains/users/services/properties/gateway-api`:
- Create UsersPropertiesV1API.ts
- Create DTOs to:
  - Read user properties by propertyId (not by userId, this will come from JWT)
  - Upsert user properties by propertyId (not by userId, this will come from JWT)