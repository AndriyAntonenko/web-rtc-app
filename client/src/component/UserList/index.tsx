import React from 'react';
import { connect } from 'react-redux';
import { SocketEventTypes, IWebSocketConnectionData } from '@webrtc_experiment/shared';

import { actions } from '../../store/reducers/user';
import { IGlobalStore } from '../../types/interfaces/IGlobalStore';
import { WebSocketService } from '../../services/WebSocketService';

import styles from './styles.module.css';

interface IUserListProps {
  users: string[];
  wsConnectionData: Partial<IWebSocketConnectionData>;
  wsService: WebSocketService;
  addUser: typeof actions.addUser;
  deleteUser: typeof actions.deleteUser;
  onUserClick: (userId: string) => void | Promise<void>;
}

const UserListComponent: React.FC<IUserListProps> = (props) => {
  const { users, wsService, addUser, wsConnectionData, deleteUser, onUserClick } = props;
  
  const handleUserJoinRoom = React.useCallback(
    (data: { id: string }) => {
      addUser([data.id]);
    },
    [addUser]
  );

  const handleUserLeaveRoom = React.useCallback(
    (data: { id: string }) => {
      deleteUser(data);
    },
    [deleteUser]
  )

  React.useEffect(() => {
    wsService.addOnEventHandler(SocketEventTypes.USER_JOIN_TO_ROOM, handleUserJoinRoom);

    wsService.addOnEventHandler(SocketEventTypes.USER_LEAVE_ROOM, handleUserLeaveRoom);

    return () => {
      wsService.removeOnEventHandler(SocketEventTypes.USER_JOIN_TO_ROOM, handleUserJoinRoom);
    }
  }, [wsService, handleUserJoinRoom, handleUserLeaveRoom]);

  React.useEffect(() => {
    if (wsConnectionData.id) {
      fetch(`http://localhost:5000/users?except=["${wsConnectionData.id}"]`, { method: 'GET' })
        .then(response => response.json())
        .then(({ ids }) => { addUser(ids); })
        .catch(console.error);
    }
  }, [wsConnectionData, addUser]);

  return (
    <ul className={styles.userList}>
      {users.map(id => (
        <li 
          className={`${styles.userListItem} ${styles.userListItemOnHover}`} 
          key={id}
          onClick={() => onUserClick(id)}
        >
          {id}
        </li>
      ))}
    </ul>
  );
};

const mapStateToProps = (store: IGlobalStore) => ({
  users: store.users,
  wsConnectionData: store.wsConnectionData
});

const actionCreators = {
  addUser: actions.addUser,
  deleteUser: actions.deleteUser
};

const ConnectedUserList = connect(mapStateToProps, actionCreators)(UserListComponent);

export { ConnectedUserList as UserList };
