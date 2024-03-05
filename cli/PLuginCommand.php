<?php

namespace BitApps\Pi\CLI;

use WP_CLI;

class PLuginCommand
{
    public const PRO_PLUGIN_SLUG = 'bit-pi-pro';

    public const PRO_PLUGIN_DIR = self::PRO_PLUGIN_SLUG;

    public const PRO_PLUGIN_INDEX = self::PRO_PLUGIN_SLUG . DIRECTORY_SEPARATOR . self::PRO_PLUGIN_SLUG . '.php';

    public const DEV = 'DEV';

    public const PRO_ACTIVE = 'PRO_ACTIVE';

    public function moveToPlugins()
    {
        $sourceDirectory = realpath(__DIR__ . DIRECTORY_SEPARATOR . '../pro');

        $destinationDirectory = WP_PLUGIN_DIR . DIRECTORY_SEPARATOR . self::PRO_PLUGIN_DIR;

        if (is_dir($sourceDirectory)) {
            if (is_plugin_inactive(self::PRO_PLUGIN_INDEX) || is_plugin_active(self::PRO_PLUGIN_INDEX)) {
                $isOldProDeleted = shell_exec('wp plugin delete ' . self::PRO_PLUGIN_SLUG);

                if (!$isOldProDeleted) {
                    return;
                }
            }

            $this->configContentUpdate(self::PRO_ACTIVE, false);

            $this->copyDirectory($sourceDirectory, $destinationDirectory);

            if (is_plugin_inactive(self::PRO_PLUGIN_INDEX)) {
                $isProActivated = shell_exec('wp plugin activate ' . self::PRO_PLUGIN_SLUG);

                if (!$isProActivated) {
                    return;
                }
            }

            WP_CLI::success('Pro plugin separated successfully!');
        } else {
            $this->configContentUpdate(self::PRO_ACTIVE, true);

            WP_CLI::error(sprintf('Source %s directory does not exist', $sourceDirectory));
        }
    }

    public function togglePro($_, $assocArgs)
    {
        if (!isset($assocArgs['active'])) {
            WP_CLI::error('missing parameter use wp pi use togglePro --active=y|n');

            return;
        }

        $flag = strtolower($assocArgs['active']) === 'y' ? true : false;

        if (is_plugin_inactive(self::PRO_PLUGIN_INDEX) || is_plugin_active(self::PRO_PLUGIN_INDEX)) {
            $isOldProDeleted = shell_exec('wp plugin delete ' . self::PRO_PLUGIN_SLUG);

            if (!$isOldProDeleted) {
                return;
            }
        }

        if ($flag) {
            $this->configContentUpdate(self::PRO_ACTIVE, true);

            WP_CLI::success('Free plugin enable with pro !');

            return;
        }

        $this->configContentUpdate(self::PRO_ACTIVE, false);

        WP_CLI::success('Free plugin disable with pro !');
    }

    public function toggleDevStatus($_, $assocArgs)
    {
        if (!isset($assocArgs['active'])) {
            WP_CLI::error('missing parameter use wp bit-pi use toggleDevStatus --active=y|n');

            return;
        }

        $flag = strtolower($assocArgs['active']) === 'y' ? true : false;

        $this->configContentUpdate(self::DEV, $flag);

        WP_CLI::success(sprintf('The %s constant is %s.', self::DEV, $flag ? 'Enable' : 'Disable'));
    }

    private function configContentUpdate($key, $flag)
    {
        $envFilePath = realpath(__DIR__ . DIRECTORY_SEPARATOR . '../.env');

        $envData = file_get_contents($envFilePath);

        $value = $flag ? 'true' : 'false';

        $pattern = "/^{$key}=(.*)/m";

        $envKeyValue = "{$key}={$value}";

        if (preg_match($pattern, $envData)) {
            $envData = preg_replace($pattern, $envKeyValue, $envData);

            $isContentUpdated = file_put_contents($envFilePath, $envData);
        } else {
            $envData .= "\n{$envKeyValue}";

            $isContentUpdated = file_put_contents($envFilePath, $envData);
        }

        if ($isContentUpdated === false) {
            WP_CLI::error(sprintf('Error writing to the file %s!', $isContentUpdated));

            exit;
        }

        return $isContentUpdated;
    }

    private function copyDirectory($source, $destination)
    {
        $dir = opendir($source);

        if (!mkdir($destination)) {
            WP_CLI::error(sprintf('Error creating %s directory', $destination));

            exit;
        }

        while (false !== ($file = readdir($dir))) {
            if (($file !== '.') && ($file !== '..')) {
                $sourcePath = $source . DIRECTORY_SEPARATOR . $file;
                $destinationPath = $destination . DIRECTORY_SEPARATOR . $file;

                if (is_dir($sourcePath)) {
                    $this->copyDirectory($sourcePath, $destinationPath);
                } else {
                    if (!copy($sourcePath, $destinationPath)) {
                        $lastError = error_get_last();
                        WP_CLI::error($lastError['message']);

                        exit;
                    }
                }
            }
        }

        closedir($dir);
    }
}
