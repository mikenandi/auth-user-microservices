import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  const seedService = app.get(SeedService);

  try {
    await seedService.seedRolesAndPermissions();
    await seedService.createSampleUser();
    console.log('Seeding complete');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
