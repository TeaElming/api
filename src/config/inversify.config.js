import { Container, decorate, inject, injectable } from 'inversify'
import 'reflect-metadata'
import IDENTIFIERS from './identifiers.js'

// Services
import { AuthService } from '../services/authService.js'
import { CommentService } from '../services/commentService.js'
import { FavoriteService } from '../services/favoriteService.js'
import { RecipeService } from '../services/recipeService.js'
import { SearchService } from '../services/searchService.js'
import { UserService } from '../services/userService.js'
import { WebhookService } from '../services/webhookService.js'

// Controllers
import { AuthController } from '../controllers/authController.js'
import { CommentsController } from '../controllers/commentsController.js'
import { FavoritesController } from '../controllers/favoritesController.js'
import { RecipeController } from '../controllers/recipeController.js'
import { SearchController } from '../controllers/searchController.js'
import { UserController } from '../controllers/userController.js'
import { WebhookController } from '../controllers/webhookController.js'

// Services
decorate(injectable(), AuthService)
decorate(injectable(), CommentService)
decorate(injectable(), FavoriteService)
decorate(injectable(), RecipeService)
decorate(injectable(), SearchService)
decorate(injectable(), UserService)
decorate(injectable(), WebhookService)

// Controllers
decorate(injectable(), AuthController)
decorate(injectable(), CommentsController)
decorate(injectable(), FavoritesController)
decorate(injectable(), RecipeController)
decorate(injectable(), SearchController)
decorate(injectable(), UserController)
decorate(injectable(), WebhookController)

// Inject webhook service into recipe and comment service
decorate(inject(IDENTIFIERS.WebhookService), RecipeService, 0)
decorate(inject(IDENTIFIERS.WebhookService), CommentService, 0)

// Inject services into controllers
decorate(inject(IDENTIFIERS.AuthService), AuthController, 0)
decorate(inject(IDENTIFIERS.CommentService), CommentsController, 0)
decorate(inject(IDENTIFIERS.FavoriteService), FavoritesController, 0)
decorate(inject(IDENTIFIERS.RecipeService), RecipeController, 0)
decorate(inject(IDENTIFIERS.SearchService), SearchController, 0)
decorate(inject(IDENTIFIERS.UserService), UserController, 0)
decorate(inject(IDENTIFIERS.WebhookService), WebhookController, 0)

const container = new Container()
// Bind services to the corresponding controllers in the container
container.bind(IDENTIFIERS.AuthService).to(AuthService).inSingletonScope()
container.bind(IDENTIFIERS.CommentService).to(CommentService).inSingletonScope()
container.bind(IDENTIFIERS.FavoriteService).to(FavoriteService).inSingletonScope()
container.bind(IDENTIFIERS.RecipeService).to(RecipeService).inSingletonScope()
container.bind(IDENTIFIERS.SearchService).to(SearchService).inSingletonScope()
container.bind(IDENTIFIERS.UserService).to(UserService).inSingletonScope()
container.bind(IDENTIFIERS.WebhookService).to(WebhookService).inSingletonScope()

// Bind controllers to container
container.bind(IDENTIFIERS.AuthController).to(AuthController).inSingletonScope()
container.bind(IDENTIFIERS.CommentController).to(CommentsController).inSingletonScope()
container.bind(IDENTIFIERS.FavoriteController).to(FavoritesController).inSingletonScope()
container.bind(IDENTIFIERS.RecipeController).to(RecipeController).inSingletonScope()
container.bind(IDENTIFIERS.SearchController).to(SearchController).inSingletonScope()
container.bind(IDENTIFIERS.UserController).to(UserController).inSingletonScope()
container.bind(IDENTIFIERS.WebhookController).to(WebhookController).inSingletonScope()

export default container
