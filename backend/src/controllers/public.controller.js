import PublicService from '../services/public.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export class PublicController {
  static getPrograms = asyncHandler(async (req, res) => {
    const programs = await PublicService.getPrograms();
    return sendSuccess(res, programs, 'Programs retrieved.');
  });

  static getStats = asyncHandler(async (req, res) => {
    const stats = await PublicService.getStats();
    return sendSuccess(res, stats, 'Institutional stats retrieved.');
  });

  static getNews = asyncHandler(async (req, res) => {
    const news = await PublicService.getNews();
    return sendSuccess(res, news, 'News and announcements retrieved.');
  });
}

export default PublicController;
