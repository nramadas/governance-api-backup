import { Injectable } from '@nestjs/common';
import type { Path } from '@nestjs/config';
import { ConfigService as _ConfigService } from '@nestjs/config';

export interface Config {
  app: {
    port: number;
    host?: string;
  };
  database: {
    host: string;
    name: string;
    password: string | undefined;
    port: number;
    username: string | undefined;
    useSsl: boolean;
  };
  external: {
    twitterBearerKey: string | undefined;
  };
  jwt: {
    userSecret: string;
  };
}

@Injectable()
export class ConfigService extends _ConfigService<Config, true> {
  get<P extends Path<Config>>(path: P) {
    const value = super.get(path, { infer: true });
    return value;
  }
}
