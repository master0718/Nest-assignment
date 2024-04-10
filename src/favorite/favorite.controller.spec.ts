import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import * as request from 'supertest';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Mock Favorite entity
class FavoriteMock {
  
}

class MockAuthGuard {
  canActivate(context): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 1 };
    return true;
  }
}

describe('FavoriteController', () => {
  let app: INestApplication;
  let favoriteService: FavoriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [
        FavoriteService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: {
            save: jest.fn().mockResolvedValue(new FavoriteMock()),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    })
    .overrideGuard(AuthGuard('jwt'))
    .useClass(MockAuthGuard)
    .compile();

    app = module.createNestApplication();
    favoriteService = module.get<FavoriteService>(FavoriteService);
    await app.init();
  });

  it('/POST favorites/:catId should mark a cat as favorite', () => {
    const catId = 1;
    const userId = 1;

    jest.spyOn(favoriteService, 'markAsFavorite').mockImplementation(async () => ({
      id: 1,
      userId,
      catId,
      isFavorite: true,
    }));

    return request(app.getHttpServer())
      .post(`/favorites/${catId}`)
      .expect(201)
      .expect({
        id: 1,
        userId,
        catId,
        isFavorite: true,
      });
  });

  it('/DELETE favorites/:catId should remove a cat from favorites', async () => {
    const catId = 1;
    const userId = 1;
  
    jest.spyOn(favoriteService, 'removeFavorite').mockImplementation(async () => undefined);
  
    const response = await request(app.getHttpServer())
      .delete(`/favorites/${catId}`)
      .expect(200);
  
    expect(response.body.message).toEqual('Cat removed from favorites successfully.');
  });

  afterAll(async () => {
    await app.close();
  });
  
});