import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import type { Application } from '@feathersjs/feathers';

export function configureAuthentication(app: Application) {
  const service = new AuthenticationService(app);
  service.register('jwt', new JWTStrategy());
  service.register('local', new LocalStrategy());

  app.use('/authentication', service);
}
