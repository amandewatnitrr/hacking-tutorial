import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import Navbar from '../components/Navbar';
import { buildHackerRoom, updateHackerRoom } from '../three/hackerRoomScene';
import { getAllLessons } from '../utils/markdownloader';
import './HomePage.css';

const WIDE = { radius: 30, phi: Math.PI * 0.35, theta: -Math.PI * 0.25, target: [0, 2, 0] };

const HomePage = () => {
  const mountRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState(document.body.getAttribute('data-theme') || 'dark');
  const firstLesson = getAllLessons()[0];

  // Follow the navbar's theme toggle (same attribute LessonTemplate watches).
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.getAttribute('data-theme') || 'dark');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const mount = mountRef.current;
    let renderer, scene, camera, frameId, refs;
    let disposed = false;
    const pointer = { x: 0, y: 0 };

    const handlePointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };

    const handleResize = () => {
      if (!renderer || !camera || !mount) return;
      const { clientWidth: w, clientHeight: h } = mount;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, mount.clientWidth / mount.clientHeight, 0.1, 100);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    buildHackerRoom(scene).then((builtRefs) => {
      if (disposed) {
        builtRefs.dispose();
        return;
      }
      refs = builtRefs;
      setReady(true);

      const clock = new THREE.Clock();
      const animate = () => {
        const t = clock.getElapsedTime();
        const theta = WIDE.theta + t * 0.04 + pointer.x * 0.15;
        const phi = WIDE.phi + pointer.y * 0.06;
        const pos = refs.sphericalToPos(WIDE.radius, phi, theta, WIDE.target);
        camera.position.copy(pos);
        camera.lookAt(...WIDE.target);

        updateHackerRoom(refs, t, themeRef.current === 'dark' ? 1 : 0);
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();
    });

    window.addEventListener('resize', handleResize);
    mount.addEventListener('pointermove', handlePointerMove);

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('pointermove', handlePointerMove);
      if (frameId) cancelAnimationFrame(frameId);
      if (refs) refs.dispose();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="home-hero">
        <div className="home-hero__canvas" ref={mountRef} />
        {!ready && <div className="home-hero__loading">Booting the lab...</div>}
        <div className="home-hero__overlay">
          <h1 className="home-hero__title">Learn to break things, safely.</h1>
          <p className="home-hero__sub">
            Hands-on ethical hacking, binary exploitation, and security architecture — in a lab that's always on.
          </p>
          {firstLesson && (
            <Link to={`/lessons/${firstLesson.slug}`} className="home-hero__cta">
              Start learning <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
        <a
          className="home-hero__credit"
          href="https://github.com/brunosimon/my-room-in-3d"
          target="_blank"
          rel="noopener noreferrer"
        >
          Room model by Bruno Simon
        </a>
      </div>
    </>
  );
};

export default HomePage;
