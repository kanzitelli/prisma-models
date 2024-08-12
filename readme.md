# ⟁ [Prisma](https://github.com/prisma/prisma) Models

[Prisma Models](https://github.com/kanzitelli/prisma-models) generates a Mapped type that includes all the generated types from your Prisma Client. This approach enables you to access Prisma models and enums from a single source. Instead of importing each type individually from the Prisma Client, you can use mapped types such as `Models["User"]` for models and `Enums["UserStatus"]` for enums.

## Usage

1. Install library (as a dev dep)

```
npm i -D prisma-models

# bun i -d prisma-models
# pnpm i -D prisma-models
# yarn add -D prisma-models
```

2. Generate `Models` and `Enums`

```tsx
// [ src/types/models.ts ]
import {Prisma} from '@prisma/client';
import {GetPrismaModels} from 'prisma-models';

export type Models = GetPrismaModels<Prisma.ModelName, Prisma.TypeMap>;
```

```tsx
// [ src/types/enums.ts ]
import {$Enums} from '@prisma/client';
import {GetPrismaEnums} from 'prisma-models';

export type Enums = GetPrismaEnums<typeof $Enums>;
```

3. Use `Models` and `Enums` in your code

```tsx
// [ src/routes/app.tsx ]
import type {Models} from '~/src/types/models';

export const loader = async () => {
  const {data, error} = await some_api.user.get();
  if (error) {
    /* ... */
  }
  const userData = data.user as Models['User'];
};
```

```tsx
// [ src/components/user-status.tsx ]
import type {Enums} from '~/src/types/enums';

type Props = {status: Enums['UserStatus']};
export const UserStatusBadge: React.FC<Props> = ({status}) => {
  const statusStr = status_to_str[status]; // ACTIVE -> Active, REJECTED -> Rejected
  const statusColor = status_to_color[status]; // ACTIVE -> green, REJECTED -> red

  return <Badge color={statusColor}>{statusStr}</Badge>;
};
```

## Motivation

The motivation behind creating this small yet useful library was to solve the challenge of using Prisma types from the backend in the frontend project within a monorepo setup. I had previously hardcoded all the types for the frontend and other projects, but this approach was not ideal, especially with over 50 tables. It was difficult to maintain and prone to errors.

In my search for a solution, I came across this [discussion](https://github.com/prisma/prisma/discussions/12453), and thanks to those who shared their solutions. However, the approach discussed there generated models without relations, whereas my requirements included models with relations, along with support for Enums.

That's where `prisma-models` came in as a drop-in solution. It not only generates models with relations but also Enums as a single Mapped type.

This approach has been tested with the latest Prisma version (v5.18.0) and should work with any Prisma version that exposes `Prisma.ModelName`, `Prisma.TypeMap` and `$Enums` from `@prisma/client`. If you encounter any issues, please don't hesitate to [report](https://github.com/kanzitelli/prisma-models/issues) them!
