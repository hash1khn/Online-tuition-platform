import PropTypes from 'prop-types';

// sections
import { Userteacherprofile } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: User Edit',
};

export default function UserTeacherPage({ params }) {
  const { id } = params;

  return <Userteacherprofile id={id} />;
}


UserTeacherPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
