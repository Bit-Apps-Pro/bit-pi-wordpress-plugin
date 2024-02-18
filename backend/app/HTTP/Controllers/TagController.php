<?php

namespace BitApps\Pi\HTTP\Controllers;

use BitApps\Pi\Deps\BitApps\WPKit\Helpers\Slug;
use BitApps\Pi\Deps\BitApps\WPKit\Http\Request\Request;
use BitApps\Pi\Model\Tag;
use WP_Error;

final class TagController
{
    public function index()
    {
        return Tag::all();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => ['required', 'sanitize:text'],
        ]);

        $validatedData['slug'] = Slug::generate($validatedData['title']);

        $tag = new Tag($validatedData);
        $status = $tag->save();

        if (!$status) {
            return new WP_Error('Tag save fail', $validatedData);
        }

        return $tag;
    }

    public function destroy(Request $request)
    {
        $getFlow = new Tag($request->id);
        $getFlow->delete();

        return $getFlow;
    }

    public function update(Request $request)
    {
        $validatedData = $request->validate([
            'id'    => ['required', 'integer'],
            'title' => ['required', 'sanitize:text'],
        ]);

        $validatedData['slug'] = Slug::generate($validatedData['title']);

        $getFlow = Tag::findOne(['id' => $request->id]);
        $getFlow->update($validatedData);
        $getFlow->save();

        return $getFlow;
    }

    public function updateStatus(Request $request)
    {
        $validatedData = $request->validate([
            'id'     => ['required', 'integer'],
            'status' => ['required', 'boolean']
        ]);

        $getFlow = Tag::findOne(['id' => $request->id]);
        $getFlow->update($validatedData);
        $getFlow->save();

        return $getFlow;
    }
}
