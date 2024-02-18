<?php

// phpcs:disable Squiz.NamingConventions.ValidVariableName.NotCamelCaps

namespace BitApps\Pi\Views;

use BitApps\Pi\Config;
use BitApps\Pi\Deps\BitApps\WPKit\Hooks\Hooks;

final class HtmlTagModifier
{
    public function __construct()
    {
        Hooks::addFilter('style_loader_tag', [$this, 'linkTagFilter'], 0, 1);
        Hooks::addFilter('script_loader_tag', [$this, 'scriptTagFilter'], 0, 1);
    }

    /**
     * Modify script tags.
     *
     * @param string $html   script tag
     * @param mixed  $handle
     * @param mixed  $href
     *
     * @return string new script tag
     */
    public function scriptTagFilter($html)
    {
        $slug = Config::SLUG;
        $typeAttribute = 'type="module"';

        $scriptsToCheck = [
            '-vite-client-helper-MODULE-js',
            '-vite-client-MODULE-js',
            '-index-MODULE-js',
        ];

        if (Config::isDev()) {
            foreach ($scriptsToCheck as $script) {
                $search = 'id="' . $slug . $script . '"';
                $replace = $search . ' ' . $typeAttribute;

                if (strpos($html, $search) !== false) {
                    $html = str_replace($search, $replace, $html);
                }
            }
        } else {
            $search = 'id="' . $slug . $scriptsToCheck[2] . '"';
            $replace = $search . ' ' . $typeAttribute;

            if (strpos($html, $search) !== false) {
                $html = str_replace($search, $replace, $html);
            }
        }

        return $html;
    }

    /**
     * Modify style tags.
     *
     * @param string $html   link tag
     * @param mixed  $handle
     * @param mixed  $href
     *
     * @return string new link tag
     */
    public function linkTagFilter($html)
    {
        $slug = Config::SLUG;

        $stylesToCheck = [
            $slug . '-googleapis-PRECONNECT-css'          => 'rel="preconnect"',
            $slug . '-gstatic-PRECONNECT-CROSSORIGIN-css' => 'crossorigin rel="crossorigin"',
        ];

        foreach ($stylesToCheck as $key => $style) {
            $search = "id='{$key}'";

            if (strpos($html, $search) !== false) {
                $html = str_replace("rel='stylesheet'", $style, $html);
            }
        }

        // if (str_contains($handle, 'PRELOAD')) {
        //     $newTag = preg_replace('/rel=("|\')stylesheet("|\')/', 'rel="preload"', $newTag);
        // }

        // if (str_contains($handle, 'SCRIPT')) {
        //     $newTag = preg_replace('/<link /', '<link as="script" ', $newTag);
        // }

        return $html;
    }
}
