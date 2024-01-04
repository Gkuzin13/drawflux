import reducer, { collaborationActions, initialState } from '../slice';
import { usersGenerator } from '@/test/data-generators';
import type { CollaborationSliceState } from '../slice';
import type { User } from 'shared';

describe('collaboration slice', () => {
  it('initializes correctly', () => {
    const collaborators = usersGenerator(4);
    const thisUser = collaborators[0];

    const state = reducer(
      undefined,
      collaborationActions.init({ thisUser, collaborators }),
    );

    expect(state).toEqual({ ...initialState, thisUser, collaborators });
  });

  it('adds a user', () => {
    const collaborators = usersGenerator(4);
    const thisUser = collaborators[0];

    const userToAdd = usersGenerator(1)[0];

    const previousState: CollaborationSliceState = {
      ...initialState,
      thisUser,
      collaborators,
    };

    const state = reducer(
      previousState,
      collaborationActions.addUser(userToAdd),
    );

    expect(state).toEqual({
      ...previousState,
      collaborators: expect.arrayContaining<User>([userToAdd]),
    });
  });

  it('updates this user', () => {
    const [thisUser] = usersGenerator(1);
    const collaborators = usersGenerator(3);

    const previousState: CollaborationSliceState = {
      collaborators,
      thisUser,
    };

    const updatedThisUser: User = {
      ...thisUser,
      name: 'New name',
      color: 'gray500',
    };

    const state = reducer(
      previousState,
      collaborationActions.updateUser(updatedThisUser),
    );

    expect(state).toEqual({ ...previousState, thisUser: updatedThisUser });
  });

  it('updates a collaborator', () => {
    const collaborators = usersGenerator(3);

    const updatedUser: User = {
      ...collaborators[0],
      name: 'New name',
      color: 'gray500',
    };

    const previousState: CollaborationSliceState = {
      ...initialState,
      collaborators,
    };

    const state = reducer(
      previousState,
      collaborationActions.updateUser(updatedUser),
    );

    expect(state).toEqual({
      ...previousState,
      collaborators: [updatedUser, collaborators[1], collaborators[2]],
    });
  });

  it('does not error or update a user if the user is not in the state', () => {
    const collaborators = usersGenerator(3);
    const userNotInState = usersGenerator(1)[0];

    const previousState: CollaborationSliceState = {
      ...initialState,
      collaborators,
    };

    const state = reducer(
      previousState,
      collaborationActions.updateUser(userNotInState),
    );

    expect(state).toEqual(previousState);
  });

  it('removes a user', () => {
    const collaborators = usersGenerator(3);
    const userToRemove = collaborators[0];

    const previousState: CollaborationSliceState = {
      ...initialState,
      collaborators,
    };

    const state = reducer(
      previousState,
      collaborationActions.removeUser({ id: userToRemove.id }),
    );

    expect(state).toEqual({
      ...previousState,
      collaborators: expect.not.arrayContaining<User>([userToRemove]),
    });
  });
});
