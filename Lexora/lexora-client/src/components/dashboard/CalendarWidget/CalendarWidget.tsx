import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../ui/Card/Card';
import styles from './CalendarWidget.module.css';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const CalendarWidget: React.FC = () => {
  const { i18n } = useTranslation(['common']);
  const isRtl = i18n.language === 'ar';

  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 8)); // May 8, 2024
  const [sessionsCount, setSessionsCount] = useState(8);

  const monthsAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = isRtl
    ? ['سبت', 'أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة']
    : ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'];

  // Days in month calculation
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    // Saturday starts at index 0, Sunday at index 1...
    return (day + 1) % 7;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Generate calendar cells
  const cells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  // Session days mapping
  const isSessionDay = (day: number) => {
    if (month === 4) {
      return [8, 15, 21, 28].includes(day);
    }
    return [3, 12, 18, 25].includes(day);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handlePrevSessionCount = () => {
    setSessionsCount(prev => Math.max(0, prev - 1));
  };

  const handleNextSessionCount = () => {
    setSessionsCount(prev => prev + 1);
  };

  return (
    <Card className={styles.calendarWidget}>
      <div className={styles.widgetHeader}>
        <div className={styles.titleBlock}>
          <Calendar size={18} className={styles.headerIcon} />
          <h3 className={styles.widgetTitle}>{isRtl ? 'التقويم' : 'Calendar'}</h3>
        </div>

        <div className={styles.monthSelector}>
          <button onClick={isRtl ? handleNextMonth : handlePrevMonth} className={styles.navBtn}>
            <ChevronLeft size={16} />
          </button>
          <span className={styles.monthLabel}>
            {isRtl ? `${monthsAr[month]} ${year}` : `${monthsEn[month]} ${year}`}
          </span>
          <button onClick={isRtl ? handlePrevMonth : handleNextMonth} className={styles.navBtn}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className={styles.calendarGrid}>
        <div className={styles.weekdaysHeader}>
          {daysOfWeek.map((day, idx) => (
            <span key={idx} className={styles.weekday}>
              {day}
            </span>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {cells.map((day, idx) => {
            const hasSession = day ? isSessionDay(day) : false;
            const isToday = day === 8 && month === 4; // Mock today May 8
            const isBlueDay = day === 21 && month === 4; // Blue circled day

            return (
              <div
                key={idx}
                className={`
                  ${styles.dayCell}
                  ${day === null ? styles.emptyCell : ''}
                  ${isToday ? styles.todayCell : ''}
                  ${isBlueDay ? styles.blueCell : ''}
                `}
              >
                {day && (
                  <>
                    <span className={styles.dayNum}>{day}</span>
                    {hasSession && <span className={styles.sessionDot} />}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.sessionsFooter}>
        <div className={styles.sessionsHeader}>
          <button onClick={handlePrevSessionCount} className={styles.footerNavBtn}>
            <ChevronLeft size={14} />
          </button>
          <div className={styles.sessionsInfo}>
            <span className={styles.sessionsLabel}>{isRtl ? 'جلسات اليوم' : 'Sessions Today'}</span>
            <span className={styles.sessionsNum}>{sessionsCount}</span>
          </div>
          <button onClick={handleNextSessionCount} className={styles.footerNavBtn}>
            <ChevronRight size={14} />
          </button>
        </div>

        <button className={styles.viewSessionsBtn}>
          {isRtl ? 'عرض جميع الجلسات' : 'View All Sessions'}
        </button>
      </div>
    </Card>
  );
};

export default CalendarWidget;
