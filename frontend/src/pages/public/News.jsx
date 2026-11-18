import React from 'react';
import { Newspaper, Calendar, Clock, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import { NEWS_ITEMS } from '../../data/news';

export const News = () => {
  return (
    <div className="space-y-16 pb-20 pt-28">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-iem-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-4">
            Press & Media
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            News, Events & Notices
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Stay updated with institutional milestones, research symposium announcements, student festival schedules, and admissions circulars.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {NEWS_ITEMS.map((item) => (
            <Card key={item.id} className="p-6 bg-white border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-bold text-iem-blue bg-blue-50 px-2.5 py-1 rounded">
                    {item.category}
                  </span>
                  <span>{item.date}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.summary}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                {item.readTime}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default News;
