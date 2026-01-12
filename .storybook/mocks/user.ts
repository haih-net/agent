import { MeQuery, UserFragment } from 'src/gql/generated'

export const mockUser: MeQuery['me'] = {
  __typename: 'User',
  id: 'mock-user-id',
  createdAt: new Date('2024-01-01'),
  username: 'john_doe',
  fullname: 'John Doe',
  image: null,
  content: null,
}

export const mockAdminUser: MeQuery['me'] = {
  ...mockUser,
  id: 'mock-admin-id',
  username: 'admin',
  fullname: 'Admin User',
}

export const mockViewedUser: UserFragment = {
  __typename: 'User',
  id: 'user-1',
  username: 'johndoe',
  fullname: 'John Doe',
  createdAt: new Date('2024-01-01'),
  image: null,
  content:
    '# About John\n\n' +
    'This profile is written in **Markdown**, but it also contains some raw HTML-like tags for testing.\n\n' +
    '<p><strong>HTML paragraph:</strong> John loves building products.</p>\n' +
    '<ul><li>Item one</li><li>Item two</li></ul>\n\n' +
    'Inline tag sample: <span style="color: red">red text</span>\n\n' +
    'Angle brackets test: <script>alert("xss")</script>\n',
}

export const mockCurrentUser: UserFragment = {
  __typename: 'User',
  id: 'current-user-id',
  username: 'currentuser',
  fullname: 'Current User',
  createdAt: new Date('2024-01-01'),
  image: null,
  content: 'I am the current user.',
}
