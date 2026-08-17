# AxiPortal

AxiPortal is the onboarding and access portal for the Axi main application. It provisions Accounts, authenticates Users, and optionally installs Packages into a selected Schema.

## Language

**Account**:
A provisioned company identity represented by an `axiAccId`.
_Avoid_: Company, application

**Schema**:
A main-application tenant that an authenticated User selects for access.
_Avoid_: Account, company

**Primary User**:
The User who owns an Account and receives its full schema information.
_Avoid_: Account owner, administrator

**Secondary User**:
A User invited to an existing Account with access to its assigned Schema or Schemas.
_Avoid_: Sub-user, added user

**Package**:
An optional installable capability queued for a Schema.
_Avoid_: Module, add-on
