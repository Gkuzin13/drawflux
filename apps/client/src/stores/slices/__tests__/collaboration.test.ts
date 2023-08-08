import reducer, { collaborationActions, initialState } from '../collaboration';
import { usersGenerator } from '@/test/data-generators';
import type { CollaborationSliceState } from '../collaboration';
import type { User } from 'shared';

describe('collaboration slice', () => {
  it('initializes correctly', () => {
    const users: CollaborationSliceState['users'] = usersGenerator(4);
    const userId = users[0].id;

    const state = reducer(
      undefined,
      collaborationActions.init({ userId, users }),
    );

    expect(state).toEqual({ ...initialState, userId, users });
  });

  it('adds a user', () => {
    const users = usersGenerator(2);
    const userId = users[0].id;

    const userToAdd = usersGenerator(1)[0];

    const previousState: CollaborationSliceState = {
      ...initialState,
      userId,
      users,
    };

    const state = reducer(
      previousState,
      collaborationActions.addUser(userToAdd),
    );

    expect(state).toEqual({
      ...previousState,
      users: expect.arrayContaining<User>([userToAdd]),
    });
  });

  it('updates a user', () => {
    const users = usersGenerator(3);

    const updatedUser: User = {
      ...users[0],
      name: 'New name',
      color: 'gray500',
    };

    const previousState: CollaborationSliceState = { ...initialState, users };

    const state = reducer(
      previousState,
      collaborationActions.updateUser(updatedUser),
    );

    expect(state).toEqual({
      ...previousState,
      users: [updatedUser, users[1], users[2]],
    });
  });

  it('does not error or update a user if the user is not in the state', () => {
    const users = usersGenerator(3);
    const userNotInState = usersGenerator(1)[0];

    const previousState: CollaborationSliceState = { ...initialState, users };

    const state = reducer(
      previousState,
      collaborationActions.updateUser(userNotInState),
    );

    expect(state).toEqual(previousState);
  });

  it('removes a user', () => {
    const users = usersGenerator(3);
    const userToRemove = users[0];

    const previousState: CollaborationSliceState = { ...initialState, users };

    const state = reducer(
      previousState,
      collaborationActions.removeUser({ id: userToRemove.id }),
    );

    expect(state).toEqual({
      ...previousState,
      users: expect.not.arrayContaining<User>([userToRemove]),
    });
  });
});
