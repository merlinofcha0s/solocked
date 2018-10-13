/* after changing this file run 'yarn run webpack:build' */
/* tslint:disable */
import '../content/scss/vendor.scss';
import 'file-saver/FileSaver.min.js';
import 'hammerjs/hammer.min.js';
// Imports all fontawesome core and solid icons
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faAlignJustify,
    faArrowLeft,
    faAsterisk,
    faBan,
    faBars,
    faBell,
    faBook,
    faCalendarAlt,
    faChartBar,
    faCheckCircle,
    faChevronLeft,
    faClock,
    faCloud,
    faCog,
    faCopy,
    faCreditCard,
    faDatabase,
    faDesktop,
    faEdit,
    faExclamationCircle,
    faExclamationTriangle,
    faExternalLinkSquareAlt,
    faEye,
    faEyeSlash,
    faFile,
    faFlag,
    faHdd,
    faHeart,
    faHome,
    faIdCard,
    faKey,
    faList,
    faLock,
    faMoneyBillAlt,
    faPencilAlt,
    faPlus,
    faRoad,
    faSave,
    faSearch,
    faServer,
    faSignInAlt,
    faSignOutAlt,
    faSort,
    faSortDown,
    faSortUp,
    faSync,
    faSyncAlt,
    faTachometerAlt,
    faTasks,
    faThList,
    faTimes,
    faTrash,
    faTrashAlt,
    faUnlockAlt,
    faUser,
    faUserPlus,
    faUserSecret,
    faWrench
} from '@fortawesome/free-solid-svg-icons';

import {
    faCcAmex,
    faCcDiscover,
    faCcMastercard,
    faCcPaypal,
    faCcVisa,
    faChrome,
    faFirefox,
    faOpera,
    faSafari,
    faTwitter
} from '@fortawesome/free-brands-svg-icons';
import { faFrown } from '@fortawesome/free-regular-svg-icons';

// Adds the SVG icon to the library so you can use it in your page
library.add(faUser);
library.add(faSort);
library.add(faSortUp);
library.add(faSortDown);
library.add(faSync);
library.add(faEye);
library.add(faBan);
library.add(faTimes);
library.add(faArrowLeft);
library.add(faSave);
library.add(faPlus);
library.add(faPencilAlt);
library.add(faBars);
library.add(faHome);
library.add(faThList);
library.add(faUserPlus);
library.add(faRoad);
library.add(faTachometerAlt);
library.add(faHeart);
library.add(faList);
library.add(faBell);
library.add(faTasks);
library.add(faBook);
library.add(faHdd);
library.add(faFlag);
library.add(faWrench);
library.add(faClock);
library.add(faCloud);
library.add(faSignOutAlt);
library.add(faSignInAlt);
library.add(faCalendarAlt);
library.add(faSearch);
library.add(faTrashAlt);
library.add(faAsterisk);
library.add(faKey);
library.add(faCcPaypal);
library.add(faCcVisa);
library.add(faCcDiscover);
library.add(faCcMastercard);
library.add(faCcAmex);
library.add(faUnlockAlt);
library.add(faCopy);
library.add(faSyncAlt);
library.add(faEye);
library.add(faEyeSlash);
library.add(faExternalLinkSquareAlt);
library.add(faAlignJustify);
library.add(faThList);
library.add(faEdit);
library.add(faTrash);
library.add(faMoneyBillAlt);
library.add(faCreditCard);
library.add(faIdCard);
library.add(faCheckCircle);
library.add(faExclamationTriangle);
library.add(faTimes);
library.add(faSearch);
library.add(faFrown);
library.add(faFirefox);
library.add(faChrome);
library.add(faOpera);
library.add(faSafari);
library.add(faChartBar);
library.add(faChevronLeft);
library.add(faFile);
library.add(faExclamationCircle);
library.add(faLock);
library.add(faTwitter);
library.add(faServer);
library.add(faCog);
library.add(faUserSecret);
library.add(faHeart);
library.add(faDatabase);
library.add(faDesktop);

// jhipster-needle-add-element-to-vendor - JHipster will add new menu items here
