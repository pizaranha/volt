import React from 'react';
import settings from '../../settings';

export default function Application() {
  return (
    <div>
      <h2>About Volt</h2>
      <p>
        Volt was made to automate common tasks that take a lot of time and make it fast like
        electricity. It was built taking the <a href="https://omatsuri.app/">omatsuri.app</a>
        project as the structure and flavored with custom tools.
        Here you will find a site with strong respect to your privacy – you will never see ads
        and it does not include analytics services (or actually any services at all). You are highly
        encouraged to explore <a href={settings.repository}>source code</a> and use it in your
        projects.
      </p>
    </div>
  );
}
