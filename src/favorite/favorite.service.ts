import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  async markAsFavorite(userId: number, catId: number): Promise<Favorite> {
    let favorite = await this.favoriteRepository.findOne({
      where: { userId, catId },
    });

    if (favorite) {
      favorite.isFavorite = true;
    } else {
      favorite = this.favoriteRepository.create({
        userId,
        catId,
        isFavorite: true,
      });
    }

    await this.favoriteRepository.save(favorite);
    return favorite;
  }

  async removeFavorite(userId: number, catId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, catId },
    });

    if (favorite) {
      await this.favoriteRepository.remove(favorite);
    }
  }
}