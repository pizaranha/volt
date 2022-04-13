import React from 'react';
import settings from '../../settings';

export default function Application() {
  return (
    <div>
      <h2>About Volt</h2>
      <p>
        Volt was made to automate common tasks that take a lot of time and turn them fast like
        electricity. It was built taking the <a href="https://omatsuri.app/">omatsuri.app</a>&nbsp;
        project done by <a href="https://github.com/rtivital">Vitaly Rtishchev</a> as the structure and
        I just removed his tools and make particular cases that people from other profession needs.
        You are highly encouraged to explore <a href={settings.repository}>source code</a> and use it in your
        projects.
      </p>
    </div>
  );
}
