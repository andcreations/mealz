Use `backend/backend-server/src/domain/users/services/crud` as reference.
Implement HTTP request and service API request to log an event.

In `backend/backend-server/src/domain/event-log/services/log/service-api` implement:
- DTO with fields `event` of type `EventLog`,
- topic
- method in the transporter.

In `backend/backend-server/src/domain/event-log/services/log/service-api`:
- handle the request in the transporter
- pass the request to the service (leave the method empty)

In `backend/backend-server/src/domain/event-log/services/log/gateway-api` implement:
- enum `GWEventLogLevel` (in directory `types`) which is the same as `EventLogLevel`.
- type `GWEventLog` (in directory `types`) with fields:
  - `eventLevel` of type `GWEventLogLevel`
  - `eventType` of type `string`,
  - `eventData` of type `object`.
- DTO `LogEventGWRequestV1`  (in directory `dtos`) with field 'event' of type `GWEventLog`.
- in `EventLogV1API.ts` add the method to `EventLogV1APIURL` and `EventLogV1API.url`.

In `backend/backend-server/src/domain/event-log/services/log/gateway` implement:
- type `GWEventLog` (in directory `types`), add validation using `class-validator`
- DTO `LogEventGWRequestV1` (in directory `dtos`), add validation using `class-validator` and `class-transform`
- HTTP POST request `/api/v1/event-log/log` which takes `LogEventGWRequestV1` as the body. Pass the request to the service.
- A method in the service which calls the transporter.