const IDENTIFIERS = {
  // Services
  AuthService: Symbol.for('AuthService'),
  CommentService: Symbol.for('CommentService'),
  FavoriteService: Symbol.for('FavoriteService'),
  RecipeService: Symbol.for('RecipeService'),
  SearchService: Symbol.for('SearchService'),
  UserService: Symbol.for('UserService'),
  WebhookService: Symbol.for('WebhookService'),

  // Controllers
  AuthController: Symbol.for('AuthController'),
  CommentController: Symbol.for('CommentController'),
  FavoriteController: Symbol.for('FavoriteController'),
  RecipeController: Symbol.for('RecipeController'),
  SearchController: Symbol.for('SearchController'),
  UserController: Symbol.for('UserController'),
  WebhookController: Symbol.for('WebhookController')
}

export default IDENTIFIERS
