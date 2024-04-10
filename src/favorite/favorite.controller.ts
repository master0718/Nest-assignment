import { Controller, Post, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoriteService } from './favorite.service';

@UseGuards(AuthGuard('jwt'))
@Controller('favorites')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @Post(':catId')
  async markAsFavorite(@Req() req, @Param('catId') catId: number) {
    return this.favoriteService.markAsFavorite(req.user.id, catId);
  }

  @Delete(':catId')
  async removeFavorite(@Req() req, @Param('catId') catId: number) {
    await this.favoriteService.removeFavorite(req.user.id, catId);
    return { message: 'Cat removed from favorites successfully.' };
  }
}