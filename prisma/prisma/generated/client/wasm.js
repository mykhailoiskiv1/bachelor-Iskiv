
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  role: 'role',
  name: 'name',
  address: 'address',
  phone: 'phone',
  lastLogin: 'lastLogin',
  isConfirmed: 'isConfirmed',
  isActive: 'isActive'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  clientName: 'clientName',
  rating: 'rating',
  content: 'content',
  status: 'status',
  companyReply: 'companyReply',
  createdAt: 'createdAt',
  projectId: 'projectId'
};

exports.Prisma.ServiceScalarFieldEnum = {
  id: 'id',
  title: 'title',
  category: 'category',
  description: 'description',
  icon: 'icon',
  isFeatured: 'isFeatured',
  sortOrder: 'sortOrder',
  isHot: 'isHot',
  createdAt: 'createdAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.WarrantyScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  clientId: 'clientId',
  startDate: 'startDate',
  durationMonths: 'durationMonths',
  projectName: 'projectName',
  createdAt: 'createdAt'
};

exports.Prisma.CertificateScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  fileUrl: 'fileUrl',
  title: 'title',
  issuedDate: 'issuedDate',
  createdAt: 'createdAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  title: 'title',
  message: 'message',
  isRead: 'isRead',
  createdAt: 'createdAt'
};

exports.Prisma.PostScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  category: 'category',
  content: 'content',
  imagePath: 'imagePath',
  seoTitle: 'seoTitle',
  seoDescription: 'seoDescription',
  seoKeywords: 'seoKeywords',
  published: 'published',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChatSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionKey: 'sessionKey',
  createdAt: 'createdAt'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  chatSessionId: 'chatSessionId',
  sender: 'sender',
  content: 'content',
  isTransferred: 'isTransferred',
  createdAt: 'createdAt'
};

exports.Prisma.KnowledgeBaseScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  createdAt: 'createdAt'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  description: 'description',
  content: 'content',
  imagePaths: 'imagePaths',
  videoUrl: 'videoUrl',
  category: 'category',
  tags: 'tags',
  location: 'location',
  completionDate: 'completionDate',
  seoTitle: 'seoTitle',
  seoDescription: 'seoDescription',
  seoKeywords: 'seoKeywords',
  published: 'published',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.ProjectTypeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  icon: 'icon',
  steps: 'steps',
  active: 'active',
  createdAt: 'createdAt'
};

exports.Prisma.WorkPackageScalarFieldEnum = {
  id: 'id',
  projectTypeId: 'projectTypeId',
  name: 'name',
  description: 'description',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt'
};

exports.Prisma.ServiceItemScalarFieldEnum = {
  id: 'id',
  packageId: 'packageId',
  name: 'name',
  description: 'description',
  group: 'group',
  unit: 'unit',
  basePrice: 'basePrice',
  multiplier: 'multiplier',
  required: 'required',
  visibleByDefault: 'visibleByDefault',
  aiSuggestible: 'aiSuggestible',
  additionalNotes: 'additionalNotes',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt'
};

exports.Prisma.ServiceOptionScalarFieldEnum = {
  id: 'id',
  serviceId: 'serviceId',
  name: 'name',
  priceDelta: 'priceDelta',
  description: 'description',
  imageUrl: 'imageUrl',
  createdAt: 'createdAt'
};

exports.Prisma.FollowUpScalarFieldEnum = {
  id: 'id',
  sourceId: 'sourceId',
  targetId: 'targetId',
  reason: 'reason',
  condition: 'condition'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  title: 'title',
  fileUrl: 'fileUrl',
  issuedDate: 'issuedDate',
  totalAmount: 'totalAmount',
  projectName: 'projectName',
  createdAt: 'createdAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  USER: 'USER',
  CLIENT: 'CLIENT',
  ADMIN: 'ADMIN'
};

exports.ReviewStatus = exports.$Enums.ReviewStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Review: 'Review',
  Service: 'Service',
  Warranty: 'Warranty',
  Certificate: 'Certificate',
  Notification: 'Notification',
  Post: 'Post',
  ChatSession: 'ChatSession',
  Message: 'Message',
  KnowledgeBase: 'KnowledgeBase',
  Project: 'Project',
  ProjectType: 'ProjectType',
  WorkPackage: 'WorkPackage',
  ServiceItem: 'ServiceItem',
  ServiceOption: 'ServiceOption',
  FollowUp: 'FollowUp',
  Invoice: 'Invoice'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
