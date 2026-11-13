import React, { useEffect, useMemo, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { getLessonsByCategory, getCategoryDisplayName } from '../utils/markdownloader';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, currentSlug }) => {
  const grouped = useMemo(() => getLessonsByCategory(), []);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const saved = Number(localStorage.getItem('sidebar-scroll') || 0);
    el.scrollTop = saved;
    const onScroll = () => localStorage.setItem('sidebar-scroll', String(el.scrollTop));
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Keep the current lesson in view when arriving from elsewhere (e.g. the
  // navbar's section menu), since the restored scroll may be far from it.
  useEffect(() => {
    const panel = scrollRef.current;
    const active = panel?.querySelector('.hl-sidebar__link.is-active');
    if (!active) return;
    const panelBox = panel.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    if (activeBox.top < panelBox.top || activeBox.bottom > panelBox.bottom) {
      panel.scrollTop += activeBox.top - panelBox.top - panelBox.height / 3;
    }
  }, [currentSlug]);

  return (
    <aside
      id="lesson-sidebar"
      className={`hl-sidebar ${isOpen ? 'hl-sidebar--open' : 'hl-sidebar--closed'}`}
    >
      <div className="hl-sidebar__panel" ref={scrollRef}>
        <div className="hl-sidebar__header">
          <span className="hl-sidebar__title">Lessons</span>
          <button className="hl-sidebar__close" onClick={onClose} aria-label="Close sidebar">×</button>
        </div>

        <div className="hl-sidebar__sections">
          {Object.keys(grouped).map((catKey) => (
            <div className="hl-sidebar__section" key={catKey}>
              <div className="hl-sidebar__heading">
                <span>{getCategoryDisplayName(catKey)}</span>
                <span className="hl-sidebar__count">{grouped[catKey].length}</span>
              </div>
              <ul className="hl-sidebar__list">
                {grouped[catKey].map((lesson) => (
                  <li key={lesson.slug} className="hl-sidebar__item">
                    <NavLink
                      to={`/lessons/${lesson.slug}`}
                      className={({ isActive }) =>
                        `hl-sidebar__link ${isActive || currentSlug === lesson.slug ? 'is-active' : ''}`
                      }
                      onClick={onClose}
                    >
                      <span className="hl-sidebar__bullet" />
                      <span className="hl-sidebar__text">{lesson.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <button
        className={`hl-sidebar__backdrop ${isOpen ? 'hl-sidebar__backdrop--show' : ''}`}
        onClick={onClose}
        aria-label="Close sidebar overlay"
      />
    </aside>
  );
};

export default Sidebar;