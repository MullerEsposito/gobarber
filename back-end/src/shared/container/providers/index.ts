import { container } from 'tsyringe';

import DiskStorageProvider from './storageProvider/implemetations/DiskStorageProvider';
import IStorageProvider from './storageProvider/model/IStorageProvider';

container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    DiskStorageProvider,
);
