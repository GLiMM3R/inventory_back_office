import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { base_url } from "@/constants/base_url";
import { User } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Props = {
  images: string[];
};

export default function ImagesPreview({ images }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div className="mx-auto max-w-xs">
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {images.length ? (
            images.map((image, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-0">
                    <Image
                      src={`${base_url}/files/products/${image}`}
                      width={400}
                      height={400}
                      alt=""
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  <User width={400} height={400} />
                </CardContent>
              </Card>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
}
