// [note] this logic is inspired by this discussion - https://github.com/prisma/prisma/discussions/12453
//        that approach only takes first level of fields and will ignore nested fields.
//        however, approach below is going recursively and changing all types till the very bottom.

/**
 * Type `GetPrismaModels` returns Models with relations of your Prisma
 *
 * Example: `export type PrismaModels = GetPrismaModels<Prisma.ModelName, Prisma.TypeMap>`
 */
export type GetPrismaModels<
  ModelName extends string,
  TypeMap extends { model: Record<ModelName, { payload: TypeMapPayload }> },
> = {
  [M in ModelName]: TransformPayload<TypeMap["model"][M]["payload"]>;
};

/**
 * Type `GetPrismaModelsClean` returns Models without relations (only fields) of your Prisma
 *
 * Example: `export type PrismaModels = GetPrismaModelsClean<Prisma.ModelName, Prisma.TypeMap>`
 */
export type GetPrismaModelsClean<
  ModelName extends string,
  TypeMap extends { model: Record<ModelName, { payload: TypeMapPayload }> },
> = {
  [M in ModelName]: ExtractScalars<TypeMap["model"][M]["payload"]>;
};

/**
 * Type `GetPrismaEnums` returns Enums with format `type UserStatus = 'ACTIVE' | 'IN_REVIEW' | 'REJECTED'` of your $Enums (from Prisma)
 *
 * Example: `export type PrismaEnums = GetPrismaEnums<typeof $Enums>`
 */
export type GetPrismaEnums<
  $Enums extends Record<string, Record<string, string>>,
> = {
  [K in keyof $Enums]: $Enums[K][keyof $Enums[K]];
};

// ========================
// ========= WALL =========
// ========================

// helpers
type ExcludeNull<T> = Exclude<T, null>;

type TypeMapPayload<T = any> = { objects: T; scalars: T };
type TypeMapObject = Record<string, RealPayload>;
type ExtractScalars<T extends TypeMapPayload> = T["scalars"];
type ExtractObjects<T extends TypeMapPayload> = T["objects"];

type OnePayload = TypeMapPayload | null;
type ManyPayloads = Array<TypeMapPayload>;
type RealPayload = OnePayload | ManyPayloads;

// trasformers
// payload_transformer = (T: TypeMapPayload) => T['scalars'] & objects_transformer(T['objects'])
type TransformPayload<T extends TypeMapPayload> = ExtractScalars<T> &
  TransformObjects<ExtractObjects<T>>;

// objects_transformer = (o: TypeMapObject, k: Key) =>
//     o[k] is payload[] -> [ i => o[k][i]['scalars] & objects_transformer(o[k][i]['objects']) ]
//     o[k] is payload   -> o[k]['scalars'] & objects_transformer(o[k]['objects'])
//     o[k] is smth else -> o[k]
//     o[k] is null      -> unknown
type TransformObjects<O extends TypeMapObject> = {
  [K in keyof O]: O[K] extends RealPayload
    ? O[K] extends ManyPayloads
      ? Array<
          ExtractScalars<O[K][number]> &
            TransformObjects<ExtractObjects<O[K][number]>>
        >
      : O[K] extends OnePayload
        ? ExtractScalars<ExcludeNull<O[K]>> &
            TransformObjects<ExtractObjects<ExcludeNull<O[K]>>>
        : unknown
    : O[K];
};
