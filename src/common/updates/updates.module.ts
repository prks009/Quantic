import { Global, Module } from '@nestjs/common';
import { UpdatesGateway } from './updates.gateway';

@Global()
@Module({
    providers: [UpdatesGateway],
    exports: [UpdatesGateway],
})
export class UpdatesModule { }