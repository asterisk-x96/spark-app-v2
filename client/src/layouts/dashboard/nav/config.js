// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_dashboard'),
  },
  {
    title: 'my goals',
    path: '/goals',
    icon: icon('ic_goals'),
  },
  {
    title: 'My Fund',
    path: '/my-fund',
    icon: icon('ic_lock'),
  },
  {
    title: 'friends',
    path: '/friends',
    icon: icon('ic_friends'),
  }
];

export default navConfig;
