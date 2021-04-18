import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Helmet from 'react-helmet';

import './App.scss';
import {
  Footer,
  SubPage,
  IndexPage,
  Hero,
  RadioPlayer,
  VideoChatHider,
  ShowList,
  Sponsors
} from './components';
import { pageview } from './utils/analytics';
import useLiveShowListId from './utils/liveShows';
import useShowList from './utils/shows';

const isLive = process.env.REACT_APP_BROADCAST_MODE === 'live';

export default () => {
  pageview();

  const showListId = useLiveShowListId();
  const showList = useShowList(showListId);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/:id">
            <SubPage />
          </Route>
          <Route path="/">
            <Helmet>
              <title>Turun Wappuradio</title>
              <meta name="description" content="Wappuradio 21.-30.4."></meta>
            </Helmet>
            <Hero controls={<VideoChatHider/>}>
              {!isLive && (
                <>
                  <img src="leima.svg" alt="Turun Wappuradio" />
                  <h1>Lähetys 21.-30.4.</h1>
                </>
              )}
              {isLive && <RadioPlayer />}
              {/* {isLive && <VideoChatHider />} */}
            </Hero>
            {/* <IndexPage />*/}
            <ShowList shows={showList} />
          </Route>
        </Switch>
      </Router>
      <Sponsors />
      <Footer />
    </div>
  );
}
