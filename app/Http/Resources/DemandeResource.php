<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DemandeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return  [
            'id' => $this->id,
            'material' => $this->material,
            'quantity' => $this->quantity,
            'status' => $this->status,
            'created_at' => $this->created_at->format('Y-m-d H:i:s')
        ];
    }
}
