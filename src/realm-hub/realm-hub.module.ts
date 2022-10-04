import { CacheModule, Module } from '@nestjs/common';

import { ConfigModule } from '@src/config/config.module';
import { RealmSettingsModule } from '@src/realm-settings/realm-settings.module';
import { RealmTreasuryModule } from '@src/realm-treasury/realm-treasury.module';

import { RealmHubResolver, RealmHubInfoTokenDetailsResolver } from './realm-hub.resolver';
import { RealmHubService } from './realm-hub.service';

@Module({
  imports: [CacheModule.register(), ConfigModule, RealmSettingsModule, RealmTreasuryModule],
  providers: [RealmHubService, RealmHubResolver, RealmHubInfoTokenDetailsResolver],
  exports: [RealmHubService],
})
export class RealmHubModule {}
