import type { Application, HookContext } from '@feathersjs/feathers';

export function configureChannels(app: Application) {
  app.on('connection', (connection) => {
    app.channel('anonymous').join(connection);
  });

  app.on('login', (payload, { connection }) => {
    if (connection) {
      const user = connection.user as { _id?: string; primaryRoleCode?: string } | undefined;
      app.channel('anonymous').leave(connection);
      if (user?._id) {
        app.channel(`user/${user._id}`).join(connection);
      }
      if (user?.primaryRoleCode) {
        app.channel(`role/${user.primaryRoleCode}`).join(connection);
      }
    }
  });

  app.publish((data, context) => {
    return app.channel('anonymous');
  });
}
