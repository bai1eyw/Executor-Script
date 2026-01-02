import { z } from 'zod';
import { insertScriptSchema, scripts, executions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  scripts: {
    list: {
      method: 'GET' as const,
      path: '/api/scripts',
      responses: {
        200: z.array(z.custom<typeof scripts.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/scripts/:id',
      responses: {
        200: z.custom<typeof scripts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/scripts',
      input: insertScriptSchema,
      responses: {
        201: z.custom<typeof scripts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/scripts/:id',
      input: insertScriptSchema.partial(),
      responses: {
        200: z.custom<typeof scripts.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/scripts/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    run: {
      method: 'POST' as const,
      path: '/api/scripts/:id/run',
      responses: {
        201: z.custom<typeof executions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  executions: {
    list: {
      method: 'GET' as const,
      path: '/api/scripts/:id/executions',
      responses: {
        200: z.array(z.custom<typeof executions.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/executions/:id',
      responses: {
        200: z.custom<typeof executions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ScriptInput = z.infer<typeof api.scripts.create.input>;
